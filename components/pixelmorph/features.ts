import {
  Eraser,
  Expand,
  ImagePlus,
  ScanFace,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  transformation: string;
  image: string;
};

export const features: Feature[] = [
  {
    slug: "background-removal",
    title: "Background removal",
    shortTitle: "Background removal",
    description: "Remove any background in a single click.",
    detail: "Create clean, studio-ready product shots in seconds. PixelMorph isolates your subject and removes the background while preserving the details that make it yours.",
    icon: ScanFace,
    transformation: "e_background_removal",
    image: "photo-1542291026-7eec264c27ff",
  },
  {
    slug: "generative-fill",
    title: "Generative fill",
    shortTitle: "Generative fill",
    description: "Expand your canvas with AI-generated detail.",
    detail: "Make room for any crop or format. Generative Fill extends your image beyond its edges with context-aware details that feel like they were always there.",
    icon: Expand,
    transformation: "c_pad,e_gen_fill",
    image: "photo-1470252649378-9c29740c9fa8",
  },
  {
    slug: "object-removal",
    title: "Object removal",
    shortTitle: "Object removal",
    description: "Erase distractions and keep the moment.",
    detail: "Clean up a scene without rebuilding it. Select an unwanted object and let generative editing fill in the space naturally.",
    icon: Eraser,
    transformation: "e_gen_remove",
    image: "photo-1500530855697-b586d89ba3ee",
  },
  {
    slug: "generative-replace",
    title: "Generative replace",
    shortTitle: "Generative replace",
    description: "Replace an object with a simple text prompt.",
    detail: "Swap an element in your image with a prompt. Keep the composition and lighting while bringing a fresh idea to life.",
    icon: Wand2,
    transformation: "e_gen_replace",
    image: "photo-1490750967868-88aa4486c946",
  },
  {
    slug: "image-restoration",
    title: "Image restoration",
    shortTitle: "Image restoration",
    description: "Upscale, sharpen, and restore image detail.",
    detail: "Give soft or low-resolution images a second life. Enhance details and bring images into focus for crisp, high-quality output.",
    icon: ImagePlus,
    transformation: "e_upscale",
    image: "photo-1517841905240-472988babdf9",
  },
];

export const sampleImages = [
  {
    name: "Golden hour",
    image: "photo-1470252649378-9c29740c9fa8",
    alt: "Sunlight over a grassy landscape at golden hour",
  },
  {
    name: "Wild blooms",
    image: "photo-1490750967868-88aa4486c946",
    alt: "Colorful flowers in soft natural light",
  },
  {
    name: "Coastal escape",
    image: "photo-1500530855697-b586d89ba3ee",
    alt: "A dramatic coastal landscape",
  },
];

export const imageUrl = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const featureBySlug = (slug: string) =>
  features.find((feature) => feature.slug === slug);
