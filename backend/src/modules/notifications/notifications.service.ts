/**
 * Notifications module business logic.
 */
import { notificationsRepository as repo } from "./notifications.repository";

export const notificationsService = {
  async list(userId: string) {
    const [notifications, unreadCount] = await Promise.all([
      repo.list(userId),
      repo.unreadCount(userId),
    ]);
    return { notifications, unreadCount };
  },

  /** Mark one notification (by id) or all unread as read. */
  async markRead(userId: string, id?: string) {
    await repo.markRead(userId, id);
    return { success: true };
  },
};
