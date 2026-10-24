/**
 * Applications module business logic: applying, withdrawing, and the
 * landlord decision flow. Approval creates the lease, marks the property
 * RENTED and withdraws competing pending applications.
 */
import { applicationsRepository as repo } from "./applications.repository";
import { notify } from "../../lib/notifications";
import { AppError, notFound } from "../../errors/AppError";
import type { SessionUser } from "../../types/session";
import type { ApplicationInput, ApplicationDecisionInput } from "./applications.validations";

export const applicationsService = {
  /** Role aware queue: tenant sees own, landlord sees their properties', admin all. */
  async list(user: SessionUser) {
    const where: Record<string, unknown> = {};
    if (user.role === "TENANT") where.tenantId = user.id;
    if (user.role === "LANDLORD") where.property = { landlordId: user.id };
    const applications = await repo.findManyForRole(where);
    return { applications };
  },

  async create(user: SessionUser, input: ApplicationInput) {
    if (user.role !== "TENANT") {
      throw new AppError("Only tenants can submit rental applications", 403);
    }

    const property = await repo.findProperty(input.propertyId);
    if (!property) throw notFound("Property not found");
    if (property.status !== "PUBLISHED" || property.approvalStatus !== "APPROVED") {
      throw new AppError("This property is not open for applications", 409);
    }

    const duplicate = await repo.findDuplicate(input.propertyId, user.id);
    if (duplicate && duplicate.status === "PENDING") {
      throw new AppError("You already have a pending application for this property", 409);
    }

    const application = await repo.create({
      propertyId: input.propertyId,
      tenantId: user.id,
      message: input.message,
      moveInDate: input.moveInDate ? new Date(input.moveInDate) : null,
      occupants: input.occupants,
      phone: input.phone,
      status: "PENDING",
    });

    await notify({
      userId: property.landlordId,
      type: "APPLICATION",
      title: "New rental application",
      message: `${user.name} applied for "${property.title}". Review the request in your applications queue.`,
    });

    return { application };
  },

  /** WITHDRAW (tenant) | APPROVE (landlord -> lease) | REJECT (landlord). */
  async decide(id: string, user: SessionUser, input: ApplicationDecisionInput) {
    // Tenant withdrawing their own pending application
    if (input.action === "WITHDRAW") {
      const app = await repo.findByIdWithProperty(id);
      if (!app) throw notFound("Application not found");
      if (app.tenantId !== user.id) {
        throw new AppError("You can only withdraw your own application", 403);
      }
      if (app.status !== "PENDING") {
        throw new AppError("Only pending applications can be withdrawn", 409);
      }
      const updated = await repo.update(id, { status: "WITHDRAWN", decidedAt: new Date() });
      await notify({
        userId: app.property.landlordId,
        type: "APPLICATION",
        title: "Application withdrawn",
        message: `An applicant withdrew their application for "${app.property.title}".`,
      });
      return { application: updated };
    }

    // Landlord decision path
    if (user.role !== "LANDLORD" && user.role !== "ADMIN") {
      throw new AppError("Only the landlord can decide on applications", 403);
    }

    const application = await repo.findByIdFull(id);
    if (!application) throw notFound("Application not found");
    if (user.role === "LANDLORD" && application.property.landlordId !== user.id) {
      throw new AppError("You can only decide on applications for your own properties", 403);
    }
    if (application.status !== "PENDING") {
      throw new AppError(
        `This application was already ${application.status.toLowerCase()}`,
        409
      );
    }

    if (input.action === "REJECT") {
      const updated = await repo.update(id, {
        status: "REJECTED",
        decisionNote: input.decisionNote,
        decidedAt: new Date(),
      });
      await notify({
        userId: application.tenantId,
        type: "APPLICATION",
        title: "Application rejected",
        message: `Your application for "${application.property.title}" was rejected.${
          input.decisionNote ? ` Note: ${input.decisionNote}` : ""
        }`,
      });
      return { application: updated };
    }

    // APPROVE - create the lease (dates, rent, deposit) in the same step
    const start = input.startDate ? new Date(input.startDate) : new Date();
    const end = input.endDate
      ? new Date(input.endDate)
      : new Date(new Date(start).setFullYear(start.getFullYear() + 1));

    const lease = await repo.createLease({
      propertyId: application.propertyId,
      tenantId: application.tenantId,
      landlordId: application.property.landlordId,
      applicationId: application.id,
      startDate: start,
      endDate: end,
      monthlyRent: application.property.price,
      deposit: input.deposit ?? application.property.price,
      paymentDay: input.paymentDay ?? 5,
      status: "ACTIVE",
    });

    await repo.update(id, {
      status: "APPROVED",
      decisionNote: input.decisionNote,
      decidedAt: new Date(),
    });

    // The property is now rented
    await repo.markPropertyRented(application.propertyId);

    // Withdraw other pending applications for the same property
    await repo.withdrawOthers(application.propertyId, id);

    await notify({
      userId: application.tenantId,
      type: "LEASE",
      title: "Application approved - lease created",
      message: `Congratulations! Your application for "${application.property.title}" was approved. A lease running ${start.toDateString()} to ${end.toDateString()} is now active.`,
    });

    return { application: { ...application, status: "APPROVED" }, lease };
  },
};
