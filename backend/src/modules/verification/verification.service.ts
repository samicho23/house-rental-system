/**
 * Verification module business logic.
 */
import { AppError } from "../../errors/AppError";
import { faydaService } from "../fayda/fayda.service";
import { verificationRepository as repo } from "./verification.repository";
import type { VerificationRequestInput } from "./verification.validations";
import type { VerificationStatus } from "./verification.types";

export const verificationService = {
  verify(input: VerificationRequestInput) {
    return faydaService.verify(input.fin);
  },

  async status(userId: string): Promise<VerificationStatus> {
    const user = await repo.findUser(userId);
    if (!user) throw new AppError("Account not found", 404);

    return {
      userId: user.id,
      verified: user.faydaVerified,
      faydaId: user.faydaId,
      verifiedAt: user.faydaVerified ? user.updatedAt.toISOString() : null,
    };
  },
};
