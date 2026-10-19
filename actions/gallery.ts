"use server";
import cloudinary from "cloudinary";
import { validatePublicId } from "@/helpers/cloudinary";

export const addFavorite = async (
  publicId: string,
  isFavorite: boolean,
): Promise<void> => {
  const safePublicId = validatePublicId(
    publicId,
    "Public ID must contain only letters, numbers, slashes, underscores, or hyphens.",
  );
  if (isFavorite) {
    await cloudinary.v2.uploader.remove_tag("favorite", [safePublicId]);
    return;
  }
  await cloudinary.v2.uploader.add_tag("favorite", [safePublicId]);
};
