"use server";

import cloudinary from "cloudinary";
import type {
  AlbumOption,
  DeleteImageResult,
  GetAlbumsResult,
} from "@/types/actions";
import {
  ensureCloudinaryConfigured,
  validatePublicId,
} from "@/helpers/cloudinary";

export const getAlbumNames = async (): Promise<GetAlbumsResult> => {
  try {
    ensureCloudinaryConfigured();
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

export const addImageToAlbum = async (
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
    typeof image.public_id !== "string"
  ) {
    throw new Error("This image has an invalid public ID.");
  }
  const safePublicId = validatePublicId(
    image.public_id,
    "This image has an invalid public ID.",
  );

  const albumsResult = await getAlbumNames();
  if (!albumsResult.success) {
    throw new Error(albumsResult.error);
  }
  if (!albumsResult.albums.some(({ name }) => name === normalizedAlbumName)) {
    await cloudinary.v2.api.create_folder(normalizedAlbumName);
  }

  let parts = safePublicId.split("/");
  if (parts.length > 1) {
    parts = parts.slice(1);
  }
  const publicId = parts.join("/");

  await cloudinary.v2.uploader.rename(
    safePublicId,
    `${normalizedAlbumName}/${publicId}`,
  );
};

export const deleteImageFromCloudinary = async (
  publicId: string,
): Promise<DeleteImageResult> => {
  try {
    const safePublicId = validatePublicId(
      publicId,
      "This image has an invalid public ID.",
    );
    ensureCloudinaryConfigured();
    const result = await cloudinary.v2.api.delete_resources([safePublicId]);
    const deletionStatus = result.deleted?.[safePublicId];

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
