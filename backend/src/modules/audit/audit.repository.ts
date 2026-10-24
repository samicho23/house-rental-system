/**
 * Audit module data access (Prisma).
 */
import { prisma } from "../../lib/prisma";

export type CreateAuditLogInput = {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: string;
  ipAddress?: string;
  userAgent?: string;
};

export type AuditLogFilters = {
  action?: string;
  entity?: string;
  actorId?: string;
  page: number;
  pageSize: number;
};

export const auditRepository = {
  create(data: CreateAuditLogInput) {
    return prisma.auditLog.create({ data });
  },

  list(filters: AuditLogFilters) {
    const where = {
      action: filters.action,
      entity: filters.entity,
      actorId: filters.actorId,
    };

    return Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
        include: {
          actor: {
            select: { id: true, firstName: true, lastName: true, email: true, role: true },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);
  },
};
