/**
 * Audit module business logic.
 */
import { auditRepository as repo, type AuditLogFilters } from "./audit.repository";

export type RecordAuditInput = {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export const auditService = {
  record(input: RecordAuditInput) {
    return repo.create({
      ...input,
      metadata: input.metadata === undefined ? undefined : JSON.stringify(input.metadata),
    });
  },

  async list(filters: AuditLogFilters) {
    const [items, total] = await repo.list(filters);
    return {
      items,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize),
      },
    };
  },
};
