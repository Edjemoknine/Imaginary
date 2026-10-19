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
      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-xs font-semibold text-[#24100d] shadow-lg shadow-[#fa7052]/15 transition hover:bg-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090c]"
    >
      <Upload size={15} />
      Upload image
    </CldUploadButton>
  );
}
