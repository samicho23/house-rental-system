/**
 * Authorization module data access.
 */
import { prisma } from "../../lib/prisma";

export const authorizationRepository = {
  findUser(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, status: true },
    });
  },
};
