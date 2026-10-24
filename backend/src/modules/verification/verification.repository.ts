/**
 * Verification module data access.
 */
import { prisma } from "../../lib/prisma";

export const verificationRepository = {
  findUser(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, faydaId: true, faydaVerified: true, updatedAt: true },
    });
  },
};
