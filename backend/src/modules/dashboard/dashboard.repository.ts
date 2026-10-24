/**
 * Dashboard module data access (Prisma).
 */
import { prisma } from "../../lib/prisma";

export const dashboardRepository = {
  countTenantPendingApplications(tenantId: string) {
    return prisma.application.count({ where: { tenantId, status: "PENDING" } });
  },
  countTenantActiveLeases(tenantId: string) {
    return prisma.lease.count({ where: { tenantId, status: "ACTIVE" } });
  },
  findTenantDuePayments(tenantId: string) {
    return prisma.payment.findMany({
      where: { lease: { tenantId }, status: { in: ["PENDING", "OVERDUE"] } },
    });
  },
  countTenantOpenMaintenance(tenantId: string) {
    return prisma.maintenanceRequest.count({
      where: { tenantId, status: { in: ["OPEN", "IN_PROGRESS"] } },
    });
  },

  countLandlordProperties(landlordId: string) {
    return prisma.property.count({ where: { landlordId } });
  },
  countLandlordPublished(landlordId: string) {
    return prisma.property.count({
      where: { landlordId, status: "PUBLISHED", approvalStatus: "APPROVED" },
    });
  },
  countLandlordPendingApplications(landlordId: string) {
    return prisma.application.count({
      where: { property: { landlordId }, status: "PENDING" },
    });
  },
  countLandlordActiveLeases(landlordId: string) {
    return prisma.lease.count({ where: { landlordId, status: "ACTIVE" } });
  },
  sumLandlordPayments(landlordId: string, status: "PAID" | "OVERDUE") {
    return prisma.payment.aggregate({
      where: { lease: { landlordId }, status },
      _sum: { amount: true },
    });
  },
  countLandlordOpenMaintenance(landlordId: string) {
    return prisma.maintenanceRequest.count({
      where: { landlordId, status: { in: ["OPEN", "IN_PROGRESS"] } },
    });
  },

  countUsers() {
    return prisma.user.count();
  },
  countUsersByRole(role: string) {
    return prisma.user.count({ where: { role } });
  },
  countProperties() {
    return prisma.property.count();
  },
  countPendingApprovals() {
    return prisma.property.count({ where: { approvalStatus: "PENDING" } });
  },
  countActiveLeases() {
    return prisma.lease.count({ where: { status: "ACTIVE" } });
  },
  sumPaymentsByStatus(status: "PAID" | "OVERDUE") {
    return prisma.payment.aggregate({ where: { status }, _sum: { amount: true } });
  },
};
