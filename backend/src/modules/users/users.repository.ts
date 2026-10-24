/**
 * Users (admin) module data access (Prisma).
 */
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const usersRepository = {
  findMany(where: Record<string, unknown>) {
    return prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        city: true,
        faydaId: true,
        faydaVerified: true,
        createdAt: true,
        _count: { select: { properties: true, applications: true, leases: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },
};
