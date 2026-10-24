/**
 * Property gallery data access (Prisma).
 */
import { prisma } from "../../lib/prisma";

export const galleryRepository = {
  property(propertyId: string) {
    return prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, landlordId: true, status: true, approvalStatus: true },
    });
  },

  photos(propertyId: string) {
    return prisma.propertyPhoto.findMany({
      where: { propertyId },
      orderBy: [{ isCover: "desc" }, { order: "asc" }],
    });
  },

  create(propertyId: string, data: { url: string; isCover: boolean; order: number }) {
    return prisma.$transaction(async (tx) => {
      if (data.isCover) {
        await tx.propertyPhoto.updateMany({
          where: { propertyId },
          data: { isCover: false },
        });
      }
      return tx.propertyPhoto.create({ data: { propertyId, ...data } });
    });
  },

  photo(photoId: string) {
    return prisma.propertyPhoto.findUnique({
      where: { id: photoId },
      select: { id: true, propertyId: true },
    });
  },

  delete(photoId: string) {
    return prisma.propertyPhoto.delete({ where: { id: photoId } });
  },

  reorder(propertyId: string, photoIds: string[]) {
    return prisma.$transaction(
      photoIds.map((id, order) =>
        prisma.propertyPhoto.updateMany({
          where: { id, propertyId },
          data: { order, isCover: order === 0 },
        })
      )
    );
  },
};
