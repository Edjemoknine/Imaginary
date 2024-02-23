"use client";
import { CldImage } from "next-cloudinary";
import { Heart } from "lucide-react";
import { addFavorite } from "@/app/gallery/actions";
import { useTransition } from "react";
import { serachResults } from "@/app/gallery/page";
const CloudIMG = (props: any & serachResults) => {
  const [isPending, startTransition] = useTransition();
  const isFavorited = props.img.tags.includes("favorite");
  return (
    <div className="relative">
      <CldImage {...props} src={props.public_id} />
      <Heart
        fill={isFavorited ? "red" : "black"}
        onClick={() => {
          startTransition(async () => {
            await addFavorite(props.public_id, isFavorited ? true : false);
          });
        }}
        size={20}
        className="absolute hover:text-red-500 cursor-pointer top-3 right-3"
      />
    </div>
  );
};

export default CloudIMG;
