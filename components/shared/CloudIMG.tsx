"use client";
import { CldImage } from "next-cloudinary";
import { Heart } from "lucide-react";
import { addFavorite } from "@/app/gallery/actions";
import { useState, useTransition } from "react";
import { serachResults } from "@/app/gallery/page";
import { useRouter } from "next/navigation";

const CloudIMG = (
  props: any & serachResults,
  onUnheart?: (unheartedResource: serachResults) => void
) => {
  const [isPending, startTransition] = useTransition();

  const [isFavorite, setIsFavorite] = useState(
    props.img.tags.includes("favorite")
  );
  const Router = useRouter();
  return (
    <div className="relative">
      <CldImage {...props} src={props.public_id} />
      <Heart
        fill={isFavorite ? "red" : "black"}
        onClick={() => {
          setTimeout(() => {
            Router.refresh();
          }, 4000);
          props.onUnheart?.(props.img);
          setIsFavorite((prev: boolean) => !prev);
          startTransition(async () => {
            await addFavorite(props.public_id, isFavorite ? true : false);
          });
        }}
        size={20}
        className="absolute hover:text-red-500 cursor-pointer top-3 right-3"
      />
    </div>
  );
};

export default CloudIMG;
