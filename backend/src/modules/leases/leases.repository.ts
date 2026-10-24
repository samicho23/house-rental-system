/**
 * Leases module data access (Prisma).
 */
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const leaseInclude = {
  property: {
    include: { photos: { where: { isCover: true }, take: 1 } },
  },
  tenant: {
    select: { id: true, firstName: true, lastName: true, email: true, phone: true },
  },
  landlord: { select: { id: true, firstName: true, lastName: true, phone: true } },
  payments: { orderBy: { dueDate: "asc" as const } },
};

export const leasesRepository = {
  findMany(where: Record<string, unknown>) {
    return prisma.lease.findMany({
      where,
      include: leaseInclude,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  },

  findById(id: string) {
    return prisma.lease.findUnique({
      where: { id },
      include: {
        property: { include: { photos: true } },
        tenant: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        landlord: { select: { id: true, firstName: true, lastName: true, phone: true } },
        payments: { orderBy: { dueDate: "asc" as const } },
      },
    });
  },

  findByIdWithRelations(id: string) {
    return prisma.lease.findUnique({
      where: { id },
      include: { property: true, tenant: true },
    });
  },

  update(id: string, data: Prisma.LeaseUncheckedUpdateInput) {
    return prisma.lease.update({ where: { id }, data });
  },

  republishProperty(propertyId: string) {
    return prisma.property.update({
      where: { id: propertyId },
      data: { status: "PUBLISHED", approvalStatus: "APPROVED" },
    });
  },
};
