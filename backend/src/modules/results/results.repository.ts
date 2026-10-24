/**
 * Results module data access (Prisma).
 */
import { prisma } from "../../lib/prisma";

const publicPropertySelect = {
  id: true,
  title: true,
  description: true,
  propertyType: true,
  listingType: true,
  city: true,
  subCity: true,
  address: true,
  price: true,
  currency: true,
  pricePeriod: true,
  bedrooms: true,
  bathrooms: true,
  areaSqm: true,
  furnished: true,
  hasParking: true,
  hasWater: true,
  amenities: true,
  availableFrom: true,
  createdAt: true,
  photos: {
    select: { id: true, url: true, isCover: true, order: true },
    orderBy: { order: "asc" as const },
  },
} as const;

export const resultsRepository = {
  publicProperties() {
    return prisma.property.findMany({
      where: { status: "PUBLISHED", approvalStatus: "APPROVED" },
      select: publicPropertySelect,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },

  async publicCounts() {
    const [properties, applications, contactMessages] = await Promise.all([
      prisma.property.count({ where: { status: "PUBLISHED", approvalStatus: "APPROVED" } }),
      prisma.application.count(),
      prisma.contactMessage.count(),
    ]);
    return { properties, applications, contactMessages };
  },

  async adminOverview() {
    const [properties, applications, contactMessages] = await Promise.all([
      prisma.property.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { photos: true },
      }),
      prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          tenant: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          property: { select: { id: true, title: true, city: true } },
        },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return { properties, applications, contactMessages };
  },
};
