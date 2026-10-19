import type { CldImageProps } from "next-cloudinary";
import type { ReactNode } from "react";
import type { SearchResult } from "@/types/gallery";

export type SiteShellProps = {
  children: ReactNode;
  variant?: "landing" | "dashboard";
};

export type ImageDialogProps = {
  image: SearchResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type DeleteImageDialogProps = ImageDialogProps & {
  onDeleted: () => void;
};

export type CloudImageCardProps = Omit<CldImageProps, "src"> & {
  public_id: string;
  img: SearchResult;
  onUnheart?: (unheartedResource: SearchResult) => void;
  onDelete?: (deletedResource: SearchResult) => void;
};

export type ImagePreviewPanelProps = {
  image: SearchResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};
