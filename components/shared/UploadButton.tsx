"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";
type UploadResult = {
  info: { public_id: string };
  event: "success";
};

const UploadButton = () => {
  const Router = useRouter();
  return (
    <Button asChild>
      <div className="flex gap-2 ">
        <Upload size={20} />
        <CldUploadButton
          onUpload={(result: UploadResult) => {
            setTimeout(() => {
              Router.refresh();
            }, 1500);
          }}
          uploadPreset="uploads"
        />
      </div>
    </Button>
  );
};

export default UploadButton;
