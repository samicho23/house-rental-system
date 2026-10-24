/**
 * Payments module data access (Prisma).
 * The payment table is an append-only ledger: no delete, no amount edits.
 */
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const paymentsRepository = {
  findMany(where: Record<string, unknown>) {
    return prisma.payment.findMany({
      where,
      include: {
        lease: {
          include: {
            property: { select: { id: true, title: true, city: true, subCity: true } },
            tenant: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        recordedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { dueDate: "desc" },
      take: 200,
    });
  },

  findLease(leaseId: string) {
    return prisma.lease.findUnique({ where: { id: leaseId }, include: { property: true } });
  },

  create(data: Prisma.PaymentUncheckedCreateInput) {
    return prisma.payment.create({ data });
  },

  findByIdWithLease(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: { lease: { include: { property: true } } },
    });
  },

  update(id: string, data: Prisma.PaymentUncheckedUpdateInput) {
    return prisma.payment.update({ where: { id }, data });
  },
};
