/**
 * Phone-number helpers. Stored values use a normalized international format.
 */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return `+${trimmed.slice(1).replace(/\D/g, "")}`;
  return trimmed.replace(/\D/g, "");
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  const digits = normalized.startsWith("+") ? normalized.slice(1) : normalized;
  return digits.length >= 9 && digits.length <= 15;
}

export function phoneSchemaMessage(phone: string): string | true {
  return isValidPhone(phone) ? true : "Enter a valid phone number";
}
