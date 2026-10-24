/**
 * Meta (public) module data access (Prisma).
 */
import { prisma } from "../../lib/prisma";

export const metaRepository = {
  countPublishedProperties() {
    return prisma.property.count({
      where: { status: "PUBLISHED", approvalStatus: "APPROVED" },
    });
  },
  countLandlords() {
    return prisma.user.count({ where: { role: "LANDLORD" } });
  },
  findDistinctCities() {
    return prisma.property.findMany({
      where: { status: "PUBLISHED", approvalStatus: "APPROVED" },
      select: { city: true },
      distinct: ["city"],
    });
  },
};
