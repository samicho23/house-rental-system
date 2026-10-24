/**
 * Notifications module data access (Prisma).
 */
import { prisma } from "../../lib/prisma";

export const notificationsRepository = {
  list(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
  },

  unreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, read: false } });
  },

  markRead(userId: string, id?: string) {
    const where: Record<string, unknown> = { userId };
    if (id) where.id = id;
    else where.read = false;
    return prisma.notification.updateMany({ where, data: { read: true } });
  },
};
