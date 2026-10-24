/**
 * Contact module data access (Prisma).
 */
import { prisma } from "../../lib/prisma";
import type { ContactMessageInput } from "./contact.validations";

export const contactRepository = {
  create(data: ContactMessageInput) {
    return prisma.contactMessage.create({ data });
  },
};
