/**
 * Reports (admin) module business logic: occupancy, rent collected per
 * month, overdue rent, listing distribution and the approval queue.
 */
import { reportsRepository as repo } from "./reports.repository";
import { refreshOverduePayments } from "../../lib/notifications";

export const reportsService = {
  async get() {
    await refreshOverduePayments();

    const [totalProperties, rented, published, pendingApprovals] = await Promise.all([
      repo.countProperties(),
      repo.countRented(),
      repo.countPublished(),
      repo.findPendingApprovals(),
    ]);

    const payments = await repo.findPaidPayments();

    // Group collected rent by month (last 6 months)
    const monthly: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthly[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`] = 0;
    }
    for (const p of payments) {
      if (!p.paidDate) continue;
      const label = `${p.paidDate.getFullYear()}-${String(p.paidDate.getMonth() + 1).padStart(2, "0")}`;
      if (label in monthly) monthly[label] += p.amount;
    }

    const overdueAgg = await repo.aggregateOverdue();
    const byType = await repo.groupByPropertyType();
    const recentUsers = await repo.findRecentUsers();

    return {
      occupancy: {
        totalProperties,
        rented,
        published,
        occupancyRate: totalProperties > 0 ? Math.round((rented / totalProperties) * 100) : 0,
      },
      rentCollectedByMonth: Object.entries(monthly).map(([month, amount]) => ({
        month,
        amount,
      })),
      overdue: {
        amount: overdueAgg._sum.amount ?? 0,
        count: overdueAgg._count ?? 0,
      },
      listingsByType: byType.map((t) => ({
        type: t.propertyType,
        count: t._count._all,
      })),
      pendingApprovals,
      recentUsers,
    };
  },
};
