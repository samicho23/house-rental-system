/**
 * Fayda module data access.
 */
import { prisma } from "../../lib/prisma";

export const faydaRepository = {
  findAccountByFin(fin: string) {
    return prisma.user.findUnique({
      where: { faydaId: fin },
      select: { role: true },
    });
  },
};
