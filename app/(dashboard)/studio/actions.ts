"use server";

import cloudinary from "cloudinary";

export type AutoTagUploadResult =
  | { success: true; tags: string[] }
  | { success: false; error: string };

export type SaveTransformedImageResult =
  | { success: true; publicId: string }
  | { success: false; error: string };

export async function saveTransformedImage(
  publicId: string,
  transformations: string[],
): Promise<SaveTransformedImageResult> {
  try {
    const trimmedPublicId = publicId.trim();

    if (
      !trimmedPublicId ||
      trimmedPublicId.length > 200 ||
      !/^[A-Za-z0-9/_.-]+$/.test(trimmedPublicId) ||
      trimmedPublicId.split("/").some((segment) => segment === "." || segment === "..")
    ) {
      throw new Error("Public ID contains unsupported characters.");
    }

    if (
      transformations.length === 0 ||
      transformations.length > 50 ||
      transformations.some(
        (transformation) =>
          typeof transformation !== "string" ||
          transformation.length === 0 ||
          transformation.length > 2000 ||
          !/^[A-Za-z0-9_:.,;= -]+$/.test(transformation),
      )
    ) {
      throw new Error("The image has no valid transformations to save.");
    }

    const credentials = cloudinary.v2.config();
    if (!credentials.cloud_name || !credentials.api_key || !credentials.api_secret) {
      throw new Error("Cloudinary server credentials are not configured.");
    }

    const transformedUrl = cloudinary.v2.url(trimmedPublicId, {
      secure: true,
      transformation: transformations.map((raw_transformation) => ({
        raw_transformation,
      })),
    });
    const savedPublicId = `${trimmedPublicId}_edited_${Date.now()}`;
    const result = await cloudinary.v2.uploader.upload(transformedUrl, {
      public_id: savedPublicId,
      resource_type: "image",
      overwrite: false,
      unique_filename: false,
    });

    if (!result.public_id) {
      throw new Error("Cloudinary did not return the saved image ID.");
    }

    return { success: true, publicId: result.public_id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Could not save the transformed image.",
    };
  }
}

export async function autoTagExistingImage(
  publicId: string,
  confidence: number,
): Promise<AutoTagUploadResult> {
  try {
    const trimmedPublicId = publicId.trim();

    if (
      !trimmedPublicId ||
      trimmedPublicId.length > 200 ||
      !/^[A-Za-z0-9/_-]+$/.test(trimmedPublicId) ||
      trimmedPublicId.split("/").some((segment) => segment === "." || segment === "..")
    ) {
      throw new Error("Public ID must contain only letters, numbers, slashes, underscores, or hyphens.");
    }

    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
      throw new Error("Tag confidence must be between 0 and 1.");
    }

    const credentials = cloudinary.v2.config();
    if (!credentials.cloud_name || !credentials.api_key || !credentials.api_secret) {
      throw new Error("Cloudinary server credentials are not configured.");
    }

    const result = await cloudinary.v2.uploader.explicit(trimmedPublicId, {
      type: "upload",
      resource_type: "image",
      categorization: "google_tagging",
      auto_tagging: confidence,
    });

    return {
      success: true,
      tags: result.tags ?? [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Image auto-tagging failed.",
    };
  }
}
