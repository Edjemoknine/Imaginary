"use server";
import cloudinary from "cloudinary";

export const addFavorite = async (publicId: string, isFavorite: boolean) => {
  isFavorite
    ? await cloudinary.v2.uploader.remove_tag("favorite", [publicId])
    : await cloudinary.v2.uploader.add_tag("favorite", [publicId]);
};
