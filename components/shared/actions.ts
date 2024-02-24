"use server";

import { serachResults } from "@/app/gallery/page";
import cloudinary from "cloudinary";

export const AddImageToAlbum = async (albumName: string, image) => {
  // console.log({ albumName, image });
  await cloudinary.v2.api.create_folder(albumName);

  await cloudinary.v2.uploader.rename(
    image.public_id,
    `${albumName}/${image.public_id}`
  );
};
