/**
 * Users (admin) module business logic: user management with suspension
 * and role changes. Admins cannot modify their own account.
 */
import { usersRepository as repo } from "./users.repository";
import { notify } from "../../lib/notifications";
import { AppError, badRequest, notFound } from "../../errors/AppError";
import type { SessionUser } from "../../types/session";
import type { AdminUserActionInput } from "./users.validations";

export const usersService = {
  async list(query: Record<string, string | undefined>) {
    const q = query.q?.trim();
    const role = query.role;

    const where: Record<string, unknown> = {};
    if (role && role !== "ALL") where.role = role;
    if (q) {
      where.OR = [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const users = await repo.findMany(where);
    return { users };
  },

  async updateAction(admin: SessionUser, input: AdminUserActionInput) {
    const target = await repo.findById(input.id);
    if (!target) throw notFound("User not found");
    if (target.id === admin.id) {
      throw new AppError("You cannot modify your own admin account", 400);
    }

    if (input.action === "SUSPEND" || input.action === "ACTIVATE") {
      const status = input.action === "SUSPEND" ? "SUSPENDED" : "ACTIVE";
      const user = await repo.update(target.id, { status });
      await notify({
        userId: user.id,
        type: "ADMIN",
        title: status === "SUSPENDED" ? "Account suspended" : "Account reactivated",
        message:
          status === "SUSPENDED"
            ? "Your account was suspended by an administrator. Contact support for details."
            : "Your account is active again. Welcome back.",
      });
      return { user };
    }

    // SET_ROLE
    if (!input.role || !["TENANT", "LANDLORD", "ADMIN"].includes(input.role)) {
      throw badRequest("Invalid role");
    }
    const user = await repo.update(target.id, { role: input.role });
    return { user };
  },
};
