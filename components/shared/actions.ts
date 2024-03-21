"use server";

import { serachResults } from "@/app/gallery/page";
import cloudinary from "cloudinary";

export const AddImageToAlbum = async (albumName: string, image:any) => {
  await cloudinary.v2.api.create_folder(albumName);

  let parts = image.public_id.split("/");
  if (parts.length > 1) {
    parts = parts.slice(1);
  }
  const publicId = parts.join("/");

  await cloudinary.v2.uploader.rename(
    image.public_id,
    `${albumName}/${publicId}`
  );
};
