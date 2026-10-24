/**
 * Auth module business logic: Fayda verification, registration, login,
 * session issuance and profile lookup. Services return plain data - the
 * controller owns HTTP concerns (cookies, status codes).
 */
import { authRepository } from "./auth.repository";
import { faydaService } from "../fayda/fayda.service";
import { hashPassword, verifyPassword, createToken } from "../../lib/auth";
import { notify } from "../../lib/notifications";
import { AppError } from "../../errors/AppError";
import type { FaydaVerifyInput, RegisterInput, LoginInput } from "./auth.validations";

export interface AuthResult {
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    faydaVerified: boolean;
    phone?: string | null;
  };
  token: string;
}

export const authService = {
  /** Step 1 of Fayda registration: verify FIN + consent, receive claims. */
  async verifyFayda(input: FaydaVerifyInput) {
    return faydaService.verify(input.fin);
  },

  /** Step 2: create the account from pre-filled claims + completed fields. */
  async register(input: RegisterInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new AppError("An account with this email already exists", 409);

    // Every account must be tied to a verified national identity
    if (!input.faydaId || !input.faydaVerified) {
      throw new AppError("Fayda verification is required before creating an account", 400);
    }
    const finTaken = await authRepository.findByFaydaId(input.faydaId);
    if (finTaken) {
      throw new AppError("This Fayda identity is already linked to an account", 409);
    }

    const user = await authRepository.createUser({
      email,
      phone: input.phone,
      password: hashPassword(input.password),
      firstName: input.firstName,
      lastName: input.lastName,
      gender: input.gender ?? null,
      dateOfBirth: input.dateOfBirth ?? null,
      city: input.city ?? null,
      subCity: input.subCity ?? null,
      role: input.role,
      faydaId: input.faydaId,
      faydaVerified: true,
    });

    await notify({
      userId: user.id,
      type: "ADMIN",
      title: "Welcome to the House and Apartment Rental System",
      message:
        input.role === "LANDLORD"
          ? "Your landlord account is ready. Publish your first property to start receiving applications."
          : "Your tenant account is ready. Search listings and apply for a home in a few clicks.",
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        faydaVerified: user.faydaVerified,
      },
      token: createToken(user.id, user.role, `${user.firstName} ${user.lastName}`),
    };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    const user = await authRepository.findByEmail(email);
    if (!user || !verifyPassword(input.password, user.password)) {
      throw new AppError("Invalid email or password", 401);
    }
    if (user.status !== "ACTIVE") {
      throw new AppError("This account is suspended. Contact an administrator.", 403);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        faydaVerified: user.faydaVerified,
        phone: user.phone,
      },
      token: createToken(user.id, user.role, `${user.firstName} ${user.lastName}`),
    };
  },

  async me(userId: string) {
    return authRepository.findById(userId);
  },
};
