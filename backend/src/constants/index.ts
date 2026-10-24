/**
 * Domain constants shared across modules:
 * roles, property lifecycle values, enums used by validations and services.
 */
export const ROLES = ["TENANT", "LANDLORD", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ACCOUNT_STATUSES = ["ACTIVE", "SUSPENDED"] as const;

export const PROPERTY_TYPES = ["HOUSE", "APARTMENT", "CONDO", "SINGLE_ROOM", "STUDIO"] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_STATUSES = ["DRAFT", "PUBLISHED", "UNPUBLISHED", "RENTED"] as const;
export const APPROVAL_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export const APPLICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"] as const;

export const PAYMENT_METHODS = ["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "CHEQUE"] as const;
export const PAYMENT_STATUSES = ["PENDING", "PAID", "OVERDUE"] as const;

export const MAINTENANCE_CATEGORIES = [
  "PLUMBING",
  "ELECTRICAL",
  "WATER",
  "STRUCTURAL",
  "GENERAL",
] as const;
export const MAINTENANCE_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export const MAINTENANCE_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export const NOTIFICATION_TYPES = [
  "APPLICATION",
  "LEASE",
  "PAYMENT",
  "MAINTENANCE",
  "ADMIN",
  "INFO",
] as const;

export const SESSION_COOKIE = "hrs_session";
export const SESSION_TTL_SECONDS = 60 * 60; // ~1 hour session, as with Fayda tokens

/** Default cover photo when a listing is created without pictures. */
export const DEFAULT_COVER = "/images/property-default.svg";
