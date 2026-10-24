/**
 * Applications module data access (Prisma).
 */
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const applicationsRepository = {
  findManyForRole(where: Record<string, unknown>) {
    return prisma.application.findMany({
      where,
      include: {
        property: {
          include: {
            photos: { where: { isCover: true }, take: 1 },
            landlord: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            faydaVerified: true,
          },
        },
        lease: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  },

  findByIdWithProperty(id: string) {
    return prisma.application.findUnique({ where: { id }, include: { property: true } });
  },

  findByIdFull(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: { property: true, tenant: true },
    });
  },

  findDuplicate(propertyId: string, tenantId: string) {
    return prisma.application.findUnique({
      where: { propertyId_tenantId: { propertyId, tenantId } },
    });
  },

  create(data: Prisma.ApplicationUncheckedCreateInput) {
    return prisma.application.create({ data, include: { property: true } });
  },

  update(id: string, data: Prisma.ApplicationUncheckedUpdateInput) {
    return prisma.application.update({ where: { id }, data });
  },

  withdrawOthers(propertyId: string, keepId: string) {
    return prisma.application.updateMany({
      where: { propertyId, status: "PENDING", id: { not: keepId } },
      data: { status: "WITHDRAWN", decisionNote: "Property was rented to another applicant" },
    });
  },

  findProperty(id: string) {
    return prisma.property.findUnique({ where: { id } });
  },

  markPropertyRented(id: string) {
    return prisma.property.update({ where: { id }, data: { status: "RENTED" } });
  },

  createLease(data: Prisma.LeaseUncheckedCreateInput) {
    return prisma.lease.create({ data });
  },
};
