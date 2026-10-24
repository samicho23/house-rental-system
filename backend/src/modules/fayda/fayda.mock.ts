/**
 * Deterministic Fayda/eSignet test provider.
 */
import type { FaydaClaims } from "./fayda.types";

export function mockFaydaAuthenticate(fin: string): FaydaClaims | null {
  const clean = fin.trim().toUpperCase();
  if (!/^[A-Z0-9]{6,12}$/.test(clean)) return null;

  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
  }

  const genders = ["Male", "Female"];
  const cities = ["Addis Ababa", "Injibara", "Bahir Dar", "Adama", "Hawassa"];
  const subCities = ["Bole", "Yeka", "Kirkos", "Arada", "Lideta", "Gullele"];

  return {
    fin: clean,
    firstName: "Fayda",
    lastName: `Holder ${clean.slice(-4)}`,
    gender: genders[hash % genders.length],
    dateOfBirth: `19${80 + (hash % 20)}-0${1 + (hash % 9)}-1${hash % 9}`,
    phone: `+2519${String(10000000 + (hash % 89999999)).slice(0, 8)}`,
    email: `${clean.toLowerCase()}@fayda.et`,
    city: cities[hash % cities.length],
    subCity: subCities[hash % subCities.length],
    verifiedAt: new Date().toISOString(),
  };
}
