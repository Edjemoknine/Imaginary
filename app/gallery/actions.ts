"use server";
import cloudinary from "cloudinary";
import { revalidatePath } from "next/cache";

export const addFavorite = async (publicId: string, isFavorite: boolean) => {
  isFavorite
    ? await cloudinary.v2.uploader.remove_tag("favorite", [publicId])
    : await cloudinary.v2.uploader.add_tag("favorite", [publicId]);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  revalidatePath("/gallery");
};
