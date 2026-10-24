/**
 * Fayda verification business logic.
 */
import { AppError } from "../../errors/AppError";
import { mockFaydaAuthenticate } from "./fayda.mock";
import { faydaRepository as repo } from "./fayda.repository";
import type { FaydaVerificationResult } from "./fayda.types";

export const faydaService = {
  async verify(fin: string): Promise<FaydaVerificationResult> {
    const claims = mockFaydaAuthenticate(fin);
    if (!claims) {
      throw new AppError("Fayda could not verify this identification number", 401);
    }

    const existing = await repo.findAccountByFin(claims.fin);
    return {
      claims,
      accountExists: Boolean(existing),
      existingRole: existing?.role ?? null,
    };
  },
};
