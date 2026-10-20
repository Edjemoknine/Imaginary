"use server";
import cloudinary from "cloudinary";
import { validatePublicId } from "@/helpers/cloudinary";
import { SearchResult } from "@/types/gallery";

export const getImages = async (search: string) => {
  return (await cloudinary.v2.search
    .expression(`resource_type:image${search ? ` AND tags=${search}` : ""}`)
    .sort_by("created_at", "desc")
    .with_field("tags")
    .max_results(60)
    .execute()) as { resources: SearchResult[] };
};
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

export const getFavoriteImages = async () => {
  return (await cloudinary.v2.search
    .expression("resource_type:image AND tags=favorite")
    .sort_by("created_at", "desc")
    .with_field("tags")
    .max_results(30)
    .execute()) as { resources: SearchResult[] };
};
