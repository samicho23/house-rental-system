/**
 * Properties module data access (Prisma).
 */
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { DEFAULT_COVER } from "../../constants";

const landlordCard = {
  select: { id: true, firstName: true, lastName: true, phone: true, faydaVerified: true },
};

const landlordFull = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
    faydaVerified: true,
    city: true,
    createdAt: true,
  },
};

export const propertiesRepository = {
  findMany(where: Record<string, unknown>) {
    return prisma.property.findMany({
      where,
      include: {
        landlord: landlordCard,
        photos: { orderBy: [{ isCover: "desc" as const }, { order: "asc" as const }] },
        _count: { select: { applications: true, leases: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    });
  },

  findById(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: {
        landlord: landlordFull,
        photos: { orderBy: [{ isCover: "desc" as const }, { order: "asc" as const }] },
      },
    });
  },

  findByIdRaw(id: string) {
    return prisma.property.findUnique({ where: { id } });
  },

  findByIdWithActiveLeases(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: { leases: { where: { status: "ACTIVE" } } },
    });
  },

  create(landlordId: string, data: Omit<Prisma.PropertyUncheckedCreateInput, "landlordId">) {
    return prisma.property.create({
      data: { landlordId, ...data },
      include: { photos: true },
    });
  },

  update(id: string, data: Prisma.PropertyUncheckedUpdateInput) {
    return prisma.property.update({
      where: { id },
      data,
      include: { photos: true },
    });
  },

  delete(id: string) {
    return prisma.property.delete({ where: { id } });
  },

  deleteApplicationsFor(propertyId: string) {
    return prisma.application.deleteMany({ where: { propertyId } });
  },

  findAdmins() {
    return prisma.user.findMany({ where: { role: "ADMIN" } });
  },
};
