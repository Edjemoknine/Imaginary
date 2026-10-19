"use client";
import { CldImage } from "next-cloudinary";
import type { CldImageProps } from "next-cloudinary";
import { Heart } from "lucide-react";
import { addFavorite } from "@/app/(dashboard)/gallery/actions";
import { useState, useTransition } from "react";
import type { serachResults } from "@/app/(dashboard)/gallery/page";
import { useRouter } from "next/navigation";
import DropDownMenu from "./DropDownMenu";

type CloudImageProps = Omit<CldImageProps, "src"> & {
  public_id: string;
  img: serachResults;
  onUnheart?: (unheartedResource: serachResults) => void;
  onDelete?: (deletedResource: serachResults) => void;
};

const CloudIMG = ({
  public_id,
  img,
  onUnheart,
  onDelete,
  ...imageProps
}: CloudImageProps) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);

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
        className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
      />
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
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-white shadow-lg backdrop-blur-md transition hover:border-rose-300/40 hover:bg-black/60 disabled:opacity-60"
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
    </div>
  );
};

export default CloudIMG;
