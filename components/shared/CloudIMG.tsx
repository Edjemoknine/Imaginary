"use client";
import { CldImage } from "next-cloudinary";
import { Eye, Heart } from "lucide-react";
import { addFavorite } from "@/actions/gallery";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DropDownMenu from "./DropDownMenu";
import ImagePreviewPanel from "./ImagePreviewPanel";
import type { CloudImageCardProps } from "@/types/components";

const CloudIMG = ({
  public_id,
  img,
  onUnheart,
  onDelete,
  ...imageProps
}: CloudImageCardProps) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isFavorite, setIsFavorite] = useState(img.tags.includes("favorite"));
  const router = useRouter();
  if (isDeleted) return null;

  return (
    <div className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141319] shadow-lg shadow-black/10">
      <CldImage
        {...imageProps}
        src={public_id}
        crop="fill"
        gravity="auto"
        format="auto"
        rawTransformations="q_auto"
        loading="lazy"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 400px"
        className="pointer-events-none h-auto w-full transition duration-300 group-hover:scale-[1.02]"
      />
      <button
        type="button"
        aria-label={`Preview ${imageProps.alt}`}
        onClick={() => setIsPreviewOpen(true)}
        className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
      >
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[11px] font-medium text-white opacity-100 shadow-lg backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <Eye size={13} />
          Preview
        </span>
      </button>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          disabled={isPending}
          onClick={() => {
            setTimeout(() => {
              router.refresh();
            }, 4000);
            if (isFavorite) onUnheart?.(img);
            setIsFavorite((previous: boolean) => !previous);
            startTransition(async () => {
              await addFavorite(public_id, isFavorite);
            });
          }}
          className="relative z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-white shadow-lg backdrop-blur-md transition hover:border-rose-300/40 hover:bg-black/60 disabled:opacity-60"
        >
          <Heart
            size={17}
            fill={isFavorite ? "currentColor" : "none"}
            className={isFavorite ? "text-rose-400" : "text-white"}
          />
        </button>
        <DropDownMenu
          image={img}
          className="text-white"
          onDeleted={() => {
            setIsDeleted(true);
            onDelete?.(img);
            router.refresh();
          }}
        />
      </div>
      <ImagePreviewPanel
        image={img}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onDeleted={() => {
          setIsDeleted(true);
          onDelete?.(img);
          router.refresh();
        }}
      />
    </div>
  );
};

export default CloudIMG;
