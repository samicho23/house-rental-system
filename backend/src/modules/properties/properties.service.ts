/**
 * Properties module business logic: search filters, listing lifecycle
 * (draft -> published -> admin approval -> rented) and ownership rules.
 */
import { propertiesRepository } from "./properties.repository";
import { notify } from "../../lib/notifications";
import { AppError, notFound } from "../../errors/AppError";
import { assertOwnership, toNumber } from "../../utils";
import { DEFAULT_COVER } from "../../constants";
import type { SessionUser } from "../../types/session";
import type { PropertyInput, PropertyUpdateInput } from "./properties.validations";

export const propertiesService = {
  /** Public search (published + approved) or a landlord's own list. */
  async search(query: Record<string, string | undefined>) {
    const q = query.q?.trim();
    const city = query.city?.trim();
    const propertyType = query.propertyType?.trim();
    const minPrice = toNumber(query.minPrice);
    const maxPrice = toNumber(query.maxPrice);
    const bedrooms = query.bedrooms;
    const landlordId = query.landlordId;
    const includeAll = query.scope === "mine";

    const where: Record<string, unknown> = {};

    if (includeAll && landlordId) {
      where.landlordId = landlordId; // landlord's own management list
    } else {
      // Public search shows only published + approved listings
      where.status = query.status === "RENTED" ? "RENTED" : "PUBLISHED";
      where.approvalStatus = "APPROVED";
    }
    if (propertyType && propertyType !== "ALL") where.propertyType = propertyType;

    const andParts: Record<string, unknown>[] = [];
    if (city) {
      andParts.push({
        OR: [{ city: { contains: city } }, { subCity: { contains: city } }],
      });
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }
    if (bedrooms && bedrooms !== "ANY") {
      where.bedrooms = { gte: Number(bedrooms) };
    }
    if (q) {
      andParts.push({
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { city: { contains: q } },
          { subCity: { contains: q } },
          { address: { contains: q } },
        ],
      });
    }
    if (andParts.length > 0) where.AND = andParts;

    const properties = await propertiesRepository.findMany(where);
    return { properties };
  },

  async detail(id: string) {
    const property = await propertiesRepository.findById(id);
    if (!property) throw notFound("Property not found");
    return { property };
  },

  async create(user: SessionUser, input: PropertyInput) {
    const { photos, amenities, availableFrom, ...rest } = input;

    const photoCreate =
      photos && photos.length > 0
        ? photos.map((url, i) => ({ url, isCover: i === 0, order: i }))
        : [{ url: DEFAULT_COVER, isCover: true, order: 0 }];

    const property = await propertiesRepository.create(user.id, {
      ...rest,
      amenities: (amenities ?? []).join(","),
      availableFrom: availableFrom ? new Date(availableFrom) : null,
      status: input.status === "DRAFT" ? ("DRAFT" as const) : ("PUBLISHED" as const),
      approvalStatus: "PENDING" as const,
      photos: { create: photoCreate },
    });

    // Notify administrators that a listing awaits approval
    const admins = await propertiesRepository.findAdmins();
    for (const admin of admins) {
      await notify({
        userId: admin.id,
        type: "ADMIN",
        title: "New listing awaiting approval",
        message: `"${property.title}" by ${user.name} is waiting for review.`,
      });
    }

    return { property };
  },

  async update(id: string, user: SessionUser, input: PropertyUpdateInput) {
    const existing = await propertiesRepository.findByIdRaw(id);
    if (!existing) throw notFound("Property not found");
    assertOwnership(existing.landlordId, user);

    const { photos, amenities, availableFrom, ...rest } = input as PropertyUpdateInput & {
      photos?: string[];
      amenities?: string[];
    };

    const property = await propertiesRepository.update(id, {
      ...rest,
      ...(amenities ? { amenities: amenities.join(",") } : {}),
      ...(availableFrom !== undefined
        ? { availableFrom: availableFrom ? new Date(availableFrom) : null }
        : {}),
      // Re-publishing a property sends it back to admin approval
      ...(rest.status === "PUBLISHED" && existing.approvalStatus !== "APPROVED"
        ? { approvalStatus: "PENDING" }
        : {}),
      ...(photos && photos.length > 0
        ? {
            photos: {
              deleteMany: {},
              create: photos.map((url, i) => ({ url, isCover: i === 0, order: i })),
            },
          }
        : {}),
    });

    return { property };
  },

  async remove(id: string, user: SessionUser) {
    const existing = await propertiesRepository.findByIdWithActiveLeases(id);
    if (!existing) throw notFound("Property not found");
    assertOwnership(existing.landlordId, user);
    if (existing.leases.length > 0) {
      throw new AppError("This property has an active lease and cannot be deleted", 409);
    }
    await propertiesRepository.deleteApplicationsFor(id);
    await propertiesRepository.delete(id);
    return { success: true };
  },
};
