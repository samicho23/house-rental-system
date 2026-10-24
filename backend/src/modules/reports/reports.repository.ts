/**
 * Reports (admin) module data access (Prisma).
 */
import { prisma } from "../../lib/prisma";

export const reportsRepository = {
  countProperties() {
    return prisma.property.count();
  },
  countRented() {
    return prisma.property.count({ where: { status: "RENTED" } });
  },
  countPublished() {
    return prisma.property.count({
      where: { status: "PUBLISHED", approvalStatus: "APPROVED" },
    });
  },
  findPendingApprovals() {
    return prisma.property.findMany({
      where: { approvalStatus: "PENDING" },
      include: {
        landlord: { select: { firstName: true, lastName: true, email: true } },
        photos: { where: { isCover: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
  },
  findPaidPayments() {
    return prisma.payment.findMany({
      where: { status: "PAID" },
      select: { amount: true, paidDate: true },
    });
  },
  aggregateOverdue() {
    return prisma.payment.aggregate({
      where: { status: "OVERDUE" },
      _sum: { amount: true },
      _count: true,
    });
  },
  groupByPropertyType() {
    return prisma.property.groupBy({
      by: ["propertyType"],
      _count: { _all: true },
    });
  },
  findRecentUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        faydaVerified: true,
      },
    });
  },
};
