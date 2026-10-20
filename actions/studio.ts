"use server";

import { auth } from "@clerk/nextjs/server";
import cloudinary from "cloudinary";
import type {
  AutoTagResult,
  SaveTransformedImageResult,
} from "@/types/actions";
import {
  ensureCloudinaryConfigured,
  validatePublicId,
} from "@/helpers/cloudinary";

const tagPublicIdPattern = /^[A-Za-z0-9/_-]+$/;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function saveTransformedImage(
  publicId: string,
  transformations: string[],
): Promise<SaveTransformedImageResult> {
  try {
    const trimmedPublicId = validatePublicId(
      publicId,
      "Public ID contains unsupported characters.",
    );
    if (
      !Array.isArray(transformations) ||
      transformations.length === 0 ||
      transformations.length > 50 ||
      transformations.some(
        (transformation) =>
          typeof transformation !== "string" ||
          transformation.length === 0 ||
          transformation.length > 2000 ||
          !/^[A-Za-z0-9_/:.,;= -]+$/.test(transformation),
      )
    ) {
      throw new Error("The image has no valid transformations to save.");
    }

    ensureCloudinaryConfigured();
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
      error: getErrorMessage(
        error,
        "Could not save the transformed image.",
      ),
    };
  }
}

export async function autoTagExistingImage(
  publicId: string,
  confidence: number,
): Promise<AutoTagResult> {
  try {
    const { has, userId } = await auth();
    if (
      !userId ||
      (!has({ plan: "pro" }) && !has({ plan: "enterprise" }))
    ) {
      throw new Error("Upgrade to Pro or Enterprise to use AI tools.");
    }

    const trimmedPublicId = validatePublicId(
      publicId,
      "Public ID must contain only letters, numbers, slashes, underscores, or hyphens.",
      tagPublicIdPattern,
    );
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
      throw new Error("Tag confidence must be between 0 and 1.");
    }

    ensureCloudinaryConfigured();
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
      error: getErrorMessage(error, "Image auto-tagging failed."),
    };
  }
}
