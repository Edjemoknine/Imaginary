"use client";

import { Upload } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";

export default function UploadButton() {
  const router = useRouter();

  return (
    <CldUploadButton
      onUpload={() => {
        setTimeout(() => router.refresh(), 1500);
      }}
      uploadPreset="uploads"
      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 text-xs font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090c]"
    >
      <Upload size={15} />
      Upload image
    </CldUploadButton>
  );
}
