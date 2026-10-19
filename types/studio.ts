import type { LucideIcon } from "lucide-react";

export type BasicToolSlug =
  | "basic-crop-fill"
  | "basic-fit"
  | "basic-face-thumbnail"
  | "basic-auto-fill-pad"
  | "basic-rounded"
  | "basic-circular"
  | "basic-rotate"
  | "basic-blur"
  | "basic-grayscale"
  | "basic-sepia"
  | "basic-brightness"
  | "basic-contrast"
  | "basic-saturation"
  | "basic-sharpen"
  | "basic-pixelate"
  | "basic-opacity"
  | "basic-tint"
  | "basic-shadow"
  | "basic-border";

export type ToolSlug =
  | "background-removal"
  | "generative-fill"
  | "object-removal"
  | "generative-replace"
  | "image-restoration"
  | "smart-crop"
  | "face-privacy"
  | "enhance"
  | "auto-enhance"
  | "improve-indoor"
  | "baseline"
  | "cartoonify"
  | "extract"
  | "generative-background-replace"
  | "generative-recolor"
  | "gradient-fade"
  | "camera-360"
  | "zoom-pan"
  | BasicToolSlug
  | "auto-tagging";

export type AspectRatio = "1:1" | "16:9" | "9:16";

export type StudioStatus =
  | "idle"
  | "uploading"
  | "applying"
  | "downloading"
  | "saving"
  | "tagging";

export type AppliedEdit = {
  id: string;
  label: string;
  transformation: string;
};

export type StudioTool = {
  slug: ToolSlug;
  category: "AI tools" | "Basic";
  label: string;
  description: string;
  icon: LucideIcon;
};

export type TransformationOptions = {
  tool: ToolSlug;
  aspectRatio: AspectRatio;
  prompt: string;
  replaceFrom: string;
  transparentBackground: boolean;
  background: string;
  effectAmount: number;
  baselineBackgroundId: string;
  recolorTarget: string;
  recolorColor: string;
  cameraUp: number;
  cameraRight: number;
  cameraFrames: number;
  zoomPanMaxZoom: number;
  zoomPanDuration: number;
};

export type CloudinaryUploadResponse = {
  public_id?: string;
  original_filename?: string;
  format?: string;
  error?: { message?: string };
};

export type StudioOptions = {
  requestedTool?: string;
  requestedPublicId?: string;
};

export type StudioPageProps = {
  searchParams?: {
    tool?: string | string[];
    publicId?: string | string[];
  };
};
