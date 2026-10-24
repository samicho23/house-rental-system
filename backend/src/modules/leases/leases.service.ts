/**
 * Leases module business logic: role aware listing with computed balances,
 * participant-scoped detail access, and the end-lease flow that republishes
 * the property.
 */
import { leasesRepository as repo } from "./leases.repository";
import { refreshOverduePayments, notify } from "../../lib/notifications";
import { AppError, notFound } from "../../errors/AppError";
import type { SessionUser } from "../../types/session";
import type { LeaseUpdateInput } from "./leases.validations";

export const leasesService = {
  async list(user: SessionUser, query: Record<string, string | undefined>) {
    await refreshOverduePayments();

    const propertyId = query.propertyId;
    const where: Record<string, unknown> = {};
    if (user.role === "TENANT") where.tenantId = user.id;
    if (user.role === "LANDLORD") where.landlordId = user.id;
    if (propertyId) where.propertyId = propertyId;

    const leases = await repo.findMany(where);

    const today = new Date();
    const leasesWithBalance = leases.map((lease) => {
      const paidTotal = lease.payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0);
      const dueTotal = lease.payments.reduce((sum, p) => sum + p.amount, 0);
      const overdue = lease.payments.filter((p) => p.status === "OVERDUE");
      const nextDue = lease.payments
        .filter((p) => p.status !== "PAID" && p.dueDate >= today)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

      return {
        ...lease,
        balance: {
          paidTotal,
          dueTotal,
          outstanding: dueTotal - paidTotal,
          overdueCount: overdue.length,
          overdueAmount: overdue.reduce((s, p) => s + p.amount, 0),
          nextDueDate: nextDue?.dueDate ?? null,
          nextDueAmount: nextDue?.amount ?? null,
        },
      };
    });

    return { leases: leasesWithBalance };
  },

  async detail(id: string, user: SessionUser) {
    const lease = await repo.findById(id);
    if (!lease) throw notFound("Lease not found");
    const allowed =
      user.role === "ADMIN" || lease.tenantId === user.id || lease.landlordId === user.id;
    if (!allowed) throw new AppError("You do not have access to this lease", 403);
    return { lease };
  },

  async update(id: string, user: SessionUser, input: LeaseUpdateInput) {
    const lease = await repo.findByIdWithRelations(id);
    if (!lease) throw notFound("Lease not found");
    if (user.role === "LANDLORD" && lease.landlordId !== user.id) {
      throw new AppError("You can only manage your own leases", 403);
    }
    if (user.role === "TENANT") {
      throw new AppError("Tenants cannot modify a lease", 403);
    }

    const updated = await repo.update(id, {
      ...(input.status ? { status: input.status } : {}),
      ...(input.monthlyRent ? { monthlyRent: input.monthlyRent } : {}),
      ...(input.endDate ? { endDate: new Date(input.endDate) } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
    });

    if (input.status === "ENDED") {
      // The unit becomes available again
      await repo.republishProperty(lease.propertyId);
      await notify({
        userId: lease.tenantId,
        type: "LEASE",
        title: "Lease ended",
        message: `Your lease for "${lease.property.title}" has been ended by the landlord.`,
      });
    }

    return { lease: updated };
  },
};
