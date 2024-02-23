"use client";
import { Button } from "@/components/ui/button";
import { CldUploadButton } from "next-cloudinary";
type UploadResult = {
  info: { public_id: string };
  event: "success";
};
const Gallery = () => {
  return (
    <section className="pt-7 px-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Gallery</h1>
        <Button asChild>
          <CldUploadButton
            onUpload={(result: UploadResult) => {
              console.log(result);
              // setImageId(result.info.public_id);
            }}
            uploadPreset="uploads"
          />
        </Button>
      </div>
    </section>
  );
};

export default Gallery;
