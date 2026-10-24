/**
 * Maintenance module data access (Prisma).
 */
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const maintenanceRepository = {
  findMany(where: Record<string, unknown>) {
    return prisma.maintenanceRequest.findMany({
      where,
      include: {
        property: { select: { id: true, title: true, city: true, subCity: true } },
        tenant: { select: { id: true, firstName: true, lastName: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  },

  findByIdWithProperty(id: string) {
    return prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { property: true },
    });
  },

  findActiveLease(propertyId: string, tenantId: string) {
    return prisma.lease.findFirst({
      where: { propertyId, tenantId, status: "ACTIVE" },
    });
  },

  create(data: Prisma.MaintenanceRequestUncheckedCreateInput) {
    return prisma.maintenanceRequest.create({ data, include: { property: true } });
  },

  update(id: string, data: Prisma.MaintenanceRequestUncheckedUpdateInput) {
    return prisma.maintenanceRequest.update({ where: { id }, data });
  },
};
