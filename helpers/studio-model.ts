import {
  Crop,
  Eraser,
  Expand,
  Image as ImageIcon,
  ImagePlus,
  ScanFace,
  Sparkles,
  Tag,
  Wand2,
} from "lucide-react";
import type {
  AspectRatio,
  BasicToolSlug,
  StudioTool,
  ToolSlug,
  TransformationOptions,
} from "@/types/studio";

const basicTools: Omit<StudioTool, "category">[] = [
  { slug: "basic-crop-fill", label: "Fill crop", description: "Crop to fill and keep the subject in view", icon: Crop },
  { slug: "basic-fit", label: "Fit", description: "Fit inside the image dimensions", icon: Expand },
  { slug: "basic-face-thumbnail", label: "Face thumbnail", description: "Create a circular face-focused thumbnail", icon: ScanFace },
  { slug: "basic-auto-fill-pad", label: "Auto fill pad", description: "Pad with an automatically generated background", icon: Expand },
  { slug: "basic-rounded", label: "Rounded corners", description: "Round the image corners", icon: ImageIcon },
  { slug: "basic-circular", label: "Circle crop", description: "Crop to a circle", icon: ImageIcon },
  { slug: "basic-rotate", label: "Rotate", description: "Rotate the image 90 degrees", icon: Crop },
  { slug: "basic-blur", label: "Blur", description: "Soften image details", icon: Expand },
  { slug: "basic-grayscale", label: "Grayscale", description: "Remove image color", icon: ImageIcon },
  { slug: "basic-sepia", label: "Sepia", description: "Apply a warm sepia tone", icon: ImageIcon },
  { slug: "basic-brightness", label: "Brightness", description: "Adjust image brightness", icon: Sparkles },
  { slug: "basic-contrast", label: "Contrast", description: "Adjust image contrast", icon: Sparkles },
  { slug: "basic-saturation", label: "Saturation", description: "Adjust color intensity", icon: Sparkles },
  { slug: "basic-sharpen", label: "Sharpen", description: "Enhance image detail", icon: Sparkles },
  { slug: "basic-pixelate", label: "Pixelate", description: "Create a pixel effect", icon: ImagePlus },
  { slug: "basic-opacity", label: "Opacity", description: "Adjust image transparency", icon: ImageIcon },
  { slug: "basic-tint", label: "Blue tint", description: "Apply a blue color tint", icon: Wand2 },
  { slug: "basic-shadow", label: "Drop shadow", description: "Add a drop shadow", icon: ImageIcon },
  { slug: "basic-border", label: "Border", description: "Add a light border", icon: ImageIcon },
];

export const tools: StudioTool[] = [
  {
    slug: "background-removal",
    category: "AI tools",
    label: "Background removal",
    description: "Isolate your subject",
    icon: ScanFace,
  },
  {
    slug: "generative-fill",
    category: "AI tools",
    label: "Generative fill",
    description: "Expand your canvas",
    icon: Expand,
  },
  {
    slug: "object-removal",
    category: "AI tools",
    label: "Object removal",
    description: "Erase distractions",
    icon: Eraser,
  },
  {
    slug: "generative-replace",
    category: "AI tools",
    label: "Generative replace",
    description: "Replace with a prompt",
    icon: Wand2,
  },
  {
    slug: "image-restoration",
    category: "AI tools",
    label: "Smart upscale",
    description: "Restore image detail",
    icon: ImagePlus,
  },
  {
    slug: "smart-crop",
    category: "AI tools",
    label: "Smart crop",
    description: "Auto-crop for portrait",
    icon: Crop,
  },
  {
    slug: "face-privacy",
    category: "AI tools",
    label: "Face privacy blur",
    description: "Blur detected faces",
    icon: ScanFace,
  },
  {
    slug: "enhance",
    category: "AI tools",
    label: "Enhance image",
    description: "Improve color, contrast, and brightness",
    icon: Sparkles,
  },
  {
    slug: "auto-enhance",
    category: "AI tools",
    label: "Auto enhance",
    description: "Automatically enhance image colors and contrast",
    icon: Sparkles,
  },
  {
    slug: "improve-indoor",
    category: "AI tools",
    label: "Indoor improve",
    description: "Improve lighting for indoor images",
    icon: ImagePlus,
  },
  {
    slug: "baseline",
    category: "AI tools",
    label: "Baseline",
    description: "Remove background and convert to grayscale",
    icon: ImagePlus,
  },
  {
    slug: "cartoonify",
    category: "AI tools",
    label: "Cartoonify",
    description: "Create a high-contrast cartoon effect",
    icon: Wand2,
  },
  {
    slug: "extract",
    category: "AI tools",
    label: "Extract subject",
    description: "Extract an object or person by description",
    icon: ScanFace,
  },
  {
    slug: "generative-background-replace",
    category: "AI tools",
    label: "Generative background",
    description: "Replace the background with a prompt",
    icon: ImagePlus,
  },
  {
    slug: "generative-recolor",
    category: "AI tools",
    label: "Generative recolor",
    description: "Recolor a described object",
    icon: Wand2,
  },
  {
    slug: "gradient-fade",
    category: "AI tools",
    label: "Gradient fade",
    description: "Fade the edges of the image",
    icon: ImageIcon,
  },
  {
    slug: "camera-360",
    category: "AI tools",
    label: "3D camera animation",
    description: "Render a 360-degree 3D animation",
    icon: Crop,
  },
  {
    slug: "zoom-pan",
    category: "AI tools",
    label: "Zoom and pan GIF",
    description: "Create a looping zoom animation",
    icon: Expand,
  },
  ...basicTools.map((tool) => ({ ...tool, category: "Basic" as const })),
  {
    slug: "auto-tagging",
    category: "AI tools",
    label: "Auto-tag image",
    description: "Label the uploaded image",
    icon: Tag,
  },
];

export const isToolSlug = (value: string | undefined): value is ToolSlug =>
  tools.some((tool) => tool.slug === value);

const normalizePrompt = (value: string) =>
  value.replace(/[,;/]/g, " ").replace(/\s+/g, " ").trim();

const basicTransformations: Record<
  BasicToolSlug,
  (amount: number) => string
> = {
  "basic-crop-fill": () => "c_fill,g_auto",
  "basic-fit": () => "c_fit",
  "basic-face-thumbnail": () => "c_thumb,g_face,h_150,w_150,z_0.75",
  "basic-auto-fill-pad": () => "b_auto,c_fill_pad,g_auto,h_800,w_1200",
  "basic-rounded": () => "c_fill,r_16",
  "basic-circular": () => "c_fill,r_max",
  "basic-rotate": () => "a_90",
  "basic-blur": (amount) => `e_blur:${amount * 8}`,
  "basic-grayscale": () => "e_grayscale",
  "basic-sepia": () => "e_sepia",
  "basic-brightness": (amount) => `e_brightness:${amount - 50}`,
  "basic-contrast": (amount) => `e_contrast:${amount - 50}`,
  "basic-saturation": (amount) => `e_saturation:${amount - 50}`,
  "basic-sharpen": (amount) => `e_sharpen:${amount}`,
  "basic-pixelate": (amount) => `e_pixelate:${amount * 8}`,
  "basic-opacity": (amount) => `o_${amount}`,
  "basic-tint": () => "e_tint:blue:30",
  "basic-shadow": () => "e_shadow:40",
  "basic-border": () => "bo_4px_solid_rgb:dddddd",
};

export function isBasicTool(tool: ToolSlug): tool is BasicToolSlug {
  return tool in basicTransformations;
}

export function buildTransformation({
  tool,
  aspectRatio,
  prompt,
  replaceFrom,
  transparentBackground,
  background,
  effectAmount,
  baselineBackgroundId,
  recolorTarget,
  recolorColor,
  cameraUp,
  cameraRight,
  cameraFrames,
  zoomPanMaxZoom,
  zoomPanDuration,
}: TransformationOptions): string {
  const cleanPrompt = normalizePrompt(prompt);

  if (isBasicTool(tool)) {
    return basicTransformations[tool](effectAmount);
  }

  switch (tool) {
    case "background-removal":
      return transparentBackground
        ? "e_background_removal"
        : `e_background_removal,c_pad,b_rgb:${background.replace("#", "")}`;
    case "generative-fill": {
      const dimensions: Record<AspectRatio, { width: number; height: number }> = {
        "1:1": { width: 1200, height: 1200 },
        "16:9": { width: 1200, height: 675 },
        "9:16": { width: 675, height: 1200 },
      };
      const { width, height } = dimensions[aspectRatio];
      return `c_pad,w_${width},h_${height},b_gen_fill${cleanPrompt ? `:${cleanPrompt}` : ""}`;
    }
    case "object-removal":
      return `e_gen_remove:prompt_${cleanPrompt}`;
    case "generative-replace":
      return `e_gen_replace:from_${normalizePrompt(replaceFrom)};to_${cleanPrompt}`;
    case "image-restoration":
      return "e_restore";
    case "smart-crop":
      return "c_auto,g_auto,ar_0.5";
    case "face-privacy":
      return "e_blur_faces:800";
    case "enhance":
      return "e_improve";
    case "auto-enhance":
      return "e_auto_enhance";
    case "improve-indoor":
      return "e_improve:indoor";
    case "baseline": {
      const backgroundId = baselineBackgroundId.trim();
      const backgroundLayer = backgroundId
        ? `/c_fill,h_150/u_${backgroundId.replace(/\//g, ":")}/c_fill,h_150/fl_layer_apply`
        : "";
      return `bl_bg-rem-gray-jxl${backgroundLayer}`;
    }
    case "cartoonify":
      return "e_cartoonify:70:80";
    case "extract":
      return `e_extract:prompt_${cleanPrompt}`;
    case "generative-background-replace":
      return `e_gen_background_replace:prompt_${cleanPrompt}`;
    case "generative-recolor":
      return `e_gen_recolor:prompt_${normalizePrompt(recolorTarget)};to-color_${recolorColor.replace("#", "")}`;
    case "gradient-fade":
      return "e_gradient_fade:symmetric:10,x_0.2,y_0.4";
    case "camera-360":
      return `e_camera:up_${cameraUp};right_${cameraRight};frames_${cameraFrames}/fl_animated,f_webp`;
    case "zoom-pan":
      return `e_zoompan:mode_ztr;maxzoom_${zoomPanMaxZoom};du_${zoomPanDuration}/e_loop/f_gif`;
    case "auto-tagging":
      return "";
    default: {
      const exhaustiveCheck: never = tool;
      return exhaustiveCheck;
    }
  }
}
