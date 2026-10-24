/**
 * Contact module business logic.
 */
import { contactRepository as repo } from "./contact.repository";
import type { ContactMessageInput } from "./contact.validations";

export const contactService = {
  async submit(input: ContactMessageInput) {
    await repo.create(input);
    return {
      success: true,
      message: "Your message has been received. We will get back to you soon.",
    };
  },
};
