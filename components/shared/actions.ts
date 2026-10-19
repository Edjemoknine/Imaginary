"use server";

import cloudinary from "cloudinary";

export type DeleteImageResult =
  | { success: true }
  | { success: false; error: string };

export type AlbumOption = { name: string; path: string };
export type GetAlbumsResult =
  | { success: true; albums: AlbumOption[] }
  | { success: false; error: string };

const publicIdPattern = /^[A-Za-z0-9/_.-]+$/;

export const getAlbumNames = async (): Promise<GetAlbumsResult> => {
  try {
    const { cloud_name, api_key, api_secret } = cloudinary.v2.config();
    if (!cloud_name || !api_key || !api_secret) {
      return {
        success: false,
        error: "Cloudinary server credentials are not configured.",
      };
    }

    const { folders } = (await cloudinary.v2.api.root_folders()) as {
      folders: AlbumOption[];
    };
    return {
      success: true,
      albums: folders.map(({ name, path }) => ({ name, path })),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not load your albums from Cloudinary.",
    };
  }
};

export const AddImageToAlbum = async (
  albumName: string,
  image: { public_id: string },
) => {
  const normalizedAlbumName = albumName.trim();
  if (
    !normalizedAlbumName ||
    normalizedAlbumName.length > 100 ||
    normalizedAlbumName.includes("/") ||
    normalizedAlbumName === "." ||
    normalizedAlbumName === ".."
  ) {
    throw new Error("Enter a valid album name.");
  }
  if (
    !image ||
    typeof image.public_id !== "string" ||
    !publicIdPattern.test(image.public_id) ||
    image.public_id.length > 200
  ) {
    throw new Error("This image has an invalid public ID.");
  }

  const albumsResult = await getAlbumNames();
  if (!albumsResult.success) {
    throw new Error(albumsResult.error);
  }
  if (!albumsResult.albums.some(({ name }) => name === normalizedAlbumName)) {
    await cloudinary.v2.api.create_folder(normalizedAlbumName);
  }

  let parts = image.public_id.split("/");
  if (parts.length > 1) {
    parts = parts.slice(1);
  }
  const publicId = parts.join("/");

  await cloudinary.v2.uploader.rename(
    image.public_id,
    `${normalizedAlbumName}/${publicId}`,
  );
};

export const deleteImageFromCloudinary = async (
  publicId: string,
): Promise<DeleteImageResult> => {
  if (typeof publicId !== "string") {
    return { success: false, error: "This image has an invalid public ID." };
  }
  const segments = publicId.split("/");
  if (
    !publicId ||
    publicId.length > 200 ||
    !publicIdPattern.test(publicId) ||
    segments.some((segment) => segment === "." || segment === "..")
  ) {
    return { success: false, error: "This image has an invalid public ID." };
  }

  try {
    const { cloud_name, api_key, api_secret } = cloudinary.v2.config();
    if (!cloud_name || !api_key || !api_secret) {
      return {
        success: false,
        error: "Cloudinary server credentials are not configured.",
      };
    }

    const result = await cloudinary.v2.api.delete_resources([publicId]);
    const deletionStatus = result.deleted?.[publicId];

    if (deletionStatus === "deleted") {
      return { success: true };
    }
    if (deletionStatus === "not_found") {
      return { success: false, error: "This image no longer exists." };
    }

    return {
      success: false,
      error: "Cloudinary did not confirm that the image was deleted.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not delete this image from Cloudinary.",
    };
  }
};
