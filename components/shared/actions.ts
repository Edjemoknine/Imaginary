"use server";

import cloudinary from "cloudinary";

export type DeleteImageResult =
  | { success: true }
  | { success: false; error: string };

const publicIdPattern = /^[A-Za-z0-9/_.-]+$/;

export const AddImageToAlbum = async (albumName: string, image: any) => {
  await cloudinary.v2.api.create_folder(albumName);

  let parts = image.public_id.split("/");
  if (parts.length > 1) {
    parts = parts.slice(1);
  }
  const publicId = parts.join("/");

  await cloudinary.v2.uploader.rename(
    image.public_id,
    `${albumName}/${publicId}`,
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
