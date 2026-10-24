/**
 * Auth module data access (Prisma).
 */
import { prisma } from "../../lib/prisma";

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByFaydaId(faydaId: string) {
    return prisma.user.findUnique({ where: { faydaId } });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        city: true,
        subCity: true,
        faydaId: true,
        faydaVerified: true,
        createdAt: true,
      },
    });
  },

  findByIdRaw(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(data: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    gender?: string | null;
    dateOfBirth?: string | null;
    city?: string | null;
    subCity?: string | null;
    role: string;
    faydaId: string;
    faydaVerified: boolean;
  }) {
    return prisma.user.create({ data });
  },
};
