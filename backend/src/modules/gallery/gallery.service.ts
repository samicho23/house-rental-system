/**
 * Property gallery business logic.
 */
import { AppError, notFound } from "../../errors/AppError";
import { assertOwnership } from "../../utils";
import type { SessionUser } from "../../types/session";
import { galleryRepository as repo } from "./gallery.repository";
import type { GalleryPhotoInput, GalleryReorderInput } from "./gallery.validations";

async function getOwnedProperty(propertyId: string, user: SessionUser) {
  const property = await repo.property(propertyId);
  if (!property) throw notFound("Property not found");
  assertOwnership(property.landlordId, user);
  return property;
}

export const galleryService = {
  async list(propertyId: string) {
    if (!(await repo.property(propertyId))) throw notFound("Property not found");
    return { photos: await repo.photos(propertyId) };
  },

  async add(propertyId: string, user: SessionUser, input: GalleryPhotoInput) {
    await getOwnedProperty(propertyId, user);
    const photos = await repo.photos(propertyId);
    const photo = await repo.create(propertyId, {
      url: input.url,
      isCover: input.isCover || photos.length === 0,
      order: input.order ?? photos.length,
    });
    return { photo };
  },

  async remove(propertyId: string, photoId: string, user: SessionUser) {
    await getOwnedProperty(propertyId, user);
    const photo = await repo.photo(photoId);
    if (!photo || photo.propertyId !== propertyId) throw notFound("Gallery photo not found");
    await repo.delete(photoId);
    return { success: true };
  },

  async reorder(propertyId: string, user: SessionUser, input: GalleryReorderInput) {
    await getOwnedProperty(propertyId, user);
    const photos = await repo.photos(propertyId);
    const existingIds = new Set(photos.map((photo) => photo.id));
    if (
      input.photoIds.length !== photos.length ||
      input.photoIds.some((id) => !existingIds.has(id))
    ) {
      throw new AppError("photoIds must contain every photo in this property gallery", 400);
    }
    await repo.reorder(propertyId, input.photoIds);
    return { photos: await repo.photos(propertyId) };
  },
};
