/**
 * Dashboard module business logic - role specific KPI blocks.
 */
import { dashboardRepository as repo } from "./dashboard.repository";
import { refreshOverduePayments } from "../../lib/notifications";
import type { SessionUser } from "../../types/session";

export const dashboardService = {
  async get(user: SessionUser) {
    await refreshOverduePayments();

    if (user.role === "TENANT") {
      const [applications, activeLeases, payments, maintenance] = await Promise.all([
        repo.countTenantPendingApplications(user.id),
        repo.countTenantActiveLeases(user.id),
        repo.findTenantDuePayments(user.id),
        repo.countTenantOpenMaintenance(user.id),
      ]);
      const outstanding = payments.reduce((s, p) => s + p.amount, 0);
      const overdue = payments
        .filter((p) => p.status === "OVERDUE")
        .reduce((s, p) => s + p.amount, 0);
      return {
        role: "TENANT",
        stats: {
          pendingApplications: applications,
          activeLeases,
          openMaintenance: maintenance,
          outstanding,
          overdue,
        },
      };
    }

    if (user.role === "LANDLORD") {
      const [properties, published, pendingApps, activeLeases, overdueAgg, maintenance] =
        await Promise.all([
          repo.countLandlordProperties(user.id),
          repo.countLandlordPublished(user.id),
          repo.countLandlordPendingApplications(user.id),
          repo.countLandlordActiveLeases(user.id),
          repo.sumLandlordPayments(user.id, "OVERDUE"),
          repo.countLandlordOpenMaintenance(user.id),
        ]);
      const collectedAgg = await repo.sumLandlordPayments(user.id, "PAID");
      return {
        role: "LANDLORD",
        stats: {
          properties,
          published,
          pendingApplications: pendingApps,
          activeLeases,
          rentCollected: collectedAgg._sum.amount ?? 0,
          overdueRent: overdueAgg._sum.amount ?? 0,
          openMaintenance: maintenance,
        },
      };
    }

    // ADMIN
    const [users, tenants, landlords, properties, pendingApprovals, activeLeases] =
      await Promise.all([
        repo.countUsers(),
        repo.countUsersByRole("TENANT"),
        repo.countUsersByRole("LANDLORD"),
        repo.countProperties(),
        repo.countPendingApprovals(),
        repo.countActiveLeases(),
      ]);
    const collectedAgg = await repo.sumPaymentsByStatus("PAID");
    const overdueAgg = await repo.sumPaymentsByStatus("OVERDUE");
    return {
      role: "ADMIN",
      stats: {
        users,
        tenants,
        landlords,
        properties,
        pendingApprovals,
        activeLeases,
        rentCollected: collectedAgg._sum.amount ?? 0,
        overdueRent: overdueAgg._sum.amount ?? 0,
      },
    };
  },
};
