import cloudinary from "cloudinary";
import type { AlbumFolder } from "@/types/albums";

export const albumAction = async (albumName: string) => {
  return await cloudinary.v2.search
    .expression(`resource_type:image AND folder=${albumName}`)
    .with_field("tags")
    .max_results(60)
    .execute();
};

export const folderAction = async () => {
  return (await cloudinary.v2.api.root_folders()) as {
    folders: AlbumFolder[];
  };
};
