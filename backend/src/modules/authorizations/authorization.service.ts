/**
 * Authorization module business logic.
 */
import { AppError } from "../../errors/AppError";
import { authorizationRepository as repo } from "./authorization.repository";
import type { AuthorizationResult } from "./authorization.type";

const permissionsByRole: Record<string, string[]> = {
  TENANT: [
    "properties:read",
    "applications:create",
    "applications:read",
    "leases:read",
    "payments:read",
    "maintenance:create",
    "notifications:read",
  ],
  LANDLORD: [
    "properties:create",
    "properties:read",
    "properties:update",
    "properties:delete",
    "applications:read",
    "applications:decide",
    "leases:read",
    "leases:update",
    "payments:create",
    "payments:update",
    "maintenance:read",
    "maintenance:update",
    "gallery:manage",
  ],
  ADMIN: ["*"],
};

export const authorizationService = {
  async getForUser(userId: string): Promise<AuthorizationResult> {
    const user = await repo.findUser(userId);
    if (!user) throw new AppError("Account not found", 404);
    if (user.status !== "ACTIVE") throw new AppError("Account is suspended", 403);

    return {
      userId: user.id,
      role: user.role,
      permissions: permissionsByRole[user.role] ?? [],
    };
  },

  hasPermission(role: string, permission: string): boolean {
    const permissions = permissionsByRole[role] ?? [];
    return permissions.includes("*") || permissions.includes(permission);
  },
};
