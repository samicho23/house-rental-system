/**
 * Maintenance module business logic: tenant reports, landlord status flow
 * (OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED) with responses.
 */
import { maintenanceRepository as repo } from "./maintenance.repository";
import { notify } from "../../lib/notifications";
import { AppError, notFound } from "../../errors/AppError";
import type { SessionUser } from "../../types/session";
import type { MaintenanceInput, MaintenanceUpdateInput } from "./maintenance.validations";

export const maintenanceService = {
  async list(user: SessionUser) {
    const where: Record<string, unknown> = {};
    if (user.role === "TENANT") where.tenantId = user.id;
    if (user.role === "LANDLORD") where.landlordId = user.id;
    const requests = await repo.findMany(where);
    return { requests };
  },

  async create(user: SessionUser, input: MaintenanceInput) {
    if (user.role !== "TENANT") {
      throw new AppError("Only tenants can submit maintenance requests", 403);
    }

    // The tenant must hold an active lease on that property
    const lease = await repo.findActiveLease(input.propertyId, user.id);
    if (!lease) {
      throw new AppError("You can only report problems for a property you rent", 403);
    }

    const request = await repo.create({
      propertyId: input.propertyId,
      leaseId: lease.id,
      tenantId: user.id,
      landlordId: lease.landlordId,
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority,
      status: "OPEN",
    });

    await notify({
      userId: lease.landlordId,
      type: "MAINTENANCE",
      title: `New ${input.priority.toLowerCase()} priority maintenance request`,
      message: `${user.name} reported "${input.title}" at "${request.property.title}".`,
    });

    return { request };
  },

  async update(id: string, user: SessionUser, input: MaintenanceUpdateInput) {
    const request = await repo.findByIdWithProperty(id);
    if (!request) throw notFound("Maintenance request not found");
    if (user.role === "LANDLORD" && request.landlordId !== user.id) {
      throw new AppError("You can only update requests for your own properties", 403);
    }
    if (user.role === "TENANT") {
      throw new AppError("Only the landlord can update a maintenance request", 403);
    }

    const resolved = input.status === "RESOLVED" || input.status === "CLOSED";

    const updated = await repo.update(id, {
      status: input.status,
      priority: input.priority ?? request.priority,
      response: input.response ?? request.response,
      resolvedAt: resolved ? new Date() : null,
    });

    await notify({
      userId: request.tenantId,
      type: "MAINTENANCE",
      title: `Maintenance request ${input.status.toLowerCase().replace("_", " ")}`,
      message: `Your request "${request.title}" at "${
        request.property.title
      }" is now ${input.status.toLowerCase().replace("_", " ")}.${
        input.response ? ` Landlord note: ${input.response}` : ""
      }`,
    });

    return { request: updated };
  },
};
