import cloudinary from "cloudinary";

const defaultPublicIdPattern = /^[A-Za-z0-9/_.-]+$/;

export function validatePublicId(
  publicId: unknown,
  errorMessage = "Public ID contains unsupported characters.",
  pattern: RegExp = defaultPublicIdPattern,
): string {
  if (typeof publicId !== "string") {
    throw new Error(errorMessage);
  }

  const trimmedPublicId = publicId.trim();
  const segments = trimmedPublicId.split("/");
  if (
    !trimmedPublicId ||
    trimmedPublicId.length > 200 ||
    !pattern.test(trimmedPublicId) ||
    segments.some((segment) => segment === "." || segment === "..")
  ) {
    throw new Error(errorMessage);
  }

  return trimmedPublicId;
}

export function ensureCloudinaryConfigured(): void {
  const { cloud_name, api_key, api_secret } = cloudinary.v2.config();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary server credentials are not configured.");
  }
}
