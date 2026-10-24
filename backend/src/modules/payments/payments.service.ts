/**
 * Payments module business logic: the append-only rent ledger.
 * Landlords record installments and confirm payments; tenants view history.
 */
import { paymentsRepository as repo } from "./payments.repository";
import { notify, refreshOverduePayments } from "../../lib/notifications";
import { AppError, notFound } from "../../errors/AppError";
import type { SessionUser } from "../../types/session";
import type { PaymentInput, PaymentActionInput } from "./payments.validations";

export const paymentsService = {
  async list(user: SessionUser, query: Record<string, string | undefined>) {
    await refreshOverduePayments();

    const leaseId = query.leaseId;
    const where: Record<string, unknown> = {};
    if (user.role === "TENANT") where.lease = { tenantId: user.id };
    if (user.role === "LANDLORD") where.lease = { landlordId: user.id };
    if (leaseId) where.leaseId = leaseId;

    const payments = await repo.findMany(where);

    const totals = {
      paid: payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0),
      pending: payments.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0),
      overdue: payments.filter((p) => p.status === "OVERDUE").reduce((s, p) => s + p.amount, 0),
    };

    return { payments, totals };
  },

  async create(user: SessionUser, input: PaymentInput) {
    const lease = await repo.findLease(input.leaseId);
    if (!lease) throw notFound("Lease not found");
    if (user.role === "LANDLORD" && lease.landlordId !== user.id) {
      throw new AppError("You can only record payments for your own leases", 403);
    }

    const payment = await repo.create({
      leaseId: input.leaseId,
      amount: input.amount,
      dueDate: new Date(input.dueDate),
      paidDate: input.paidDate ? new Date(input.paidDate) : null,
      method: input.method,
      status: input.status === "PAID" && !input.paidDate ? "PAID" : input.status,
      periodLabel:
        input.periodLabel ??
        `${new Date(input.dueDate).getFullYear()}-${String(
          new Date(input.dueDate).getMonth() + 1
        ).padStart(2, "0")}`,
      note: input.note,
      recordedById: user.id,
    });

    // Records are append-only: corrections create new records, nothing is deleted
    await notify({
      userId: lease.tenantId,
      type: "PAYMENT",
      title: input.status === "PAID" ? "Rent payment recorded" : "Rent installment scheduled",
      message:
        input.status === "PAID"
          ? `A payment of ${input.amount.toLocaleString()} ETB for "${lease.property.title}" was recorded by the landlord.`
          : `Rent of ${input.amount.toLocaleString()} ETB is due on ${new Date(
              input.dueDate
            ).toDateString()} for "${lease.property.title}".`,
    });

    return { payment };
  },

  async update(id: string, user: SessionUser, input: PaymentActionInput) {
    const payment = await repo.findByIdWithLease(id);
    if (!payment) throw notFound("Payment record not found");
    if (user.role === "LANDLORD" && payment.lease.landlordId !== user.id) {
      throw new AppError("You can only update payments for your own leases", 403);
    }

    const paidDate = input.action === "MARK_PAID" ? new Date() : null;
    const updated = await repo.update(id, {
      status: input.action === "MARK_PAID" ? "PAID" : "PENDING",
      paidDate,
      method: input.method ?? payment.method,
      note: input.note ?? payment.note,
    });

    await notify({
      userId: payment.lease.tenantId,
      type: "PAYMENT",
      title: input.action === "MARK_PAID" ? "Payment confirmed" : "Payment reopened",
      message:
        input.action === "MARK_PAID"
          ? `Your ${payment.amount.toLocaleString()} ETB payment for "${payment.lease.property.title}" was confirmed by the landlord.`
          : `The ${payment.amount.toLocaleString()} ETB installment for "${payment.lease.property.title}" was reopened.`,
    });

    return { payment: updated };
  },
};
