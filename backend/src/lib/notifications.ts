/**
 * Notification service - creates in-app notifications for application
 * decisions, lease changes, due rent and maintenance updates.
 */
import { prisma } from "./prisma";
import { NOTIFICATION_TYPES } from "../constants";

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export async function notify(input: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}) {
  try {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
      },
    });
  } catch (err) {
    // never let notification failures break the main flow
    console.error("[notify]", err);
  }
}

/** Recompute OVERDUE flags for unpaid installments whose due date passed. */
export async function refreshOverduePayments() {
  try {
    await prisma.payment.updateMany({
      where: { status: "PENDING", dueDate: { lt: new Date() } },
      data: { status: "OVERDUE" },
    });
  } catch {
    // ignore
  }
}

/** Generate the next monthly rent installment dates for a lease. */
export function nextRentPeriods(
  lease: { id: string; startDate: Date; endDate: Date; monthlyRent: number; paymentDay: number },
  existingPeriods: Set<string>
): { dueDate: Date; periodLabel: string; amount: number }[] {
  const periods: { dueDate: Date; periodLabel: string; amount: number }[] = [];
  const cursor = new Date(lease.startDate);
  const end = new Date(lease.endDate);
  while (cursor <= end) {
    const label = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    if (!existingPeriods.has(label)) {
      const due = new Date(cursor.getFullYear(), cursor.getMonth(), lease.paymentDay);
      periods.push({ dueDate: due, periodLabel: label, amount: lease.monthlyRent });
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return periods;
}
