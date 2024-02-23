"use client";

import { CldImage } from "next-cloudinary";
import { useState } from "react";

export default function Home() {
  const [imageId, setImageId] = useState("");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {imageId && (
        <CldImage
          width="360"
          height="300"
          src={imageId}
          sizes="100vw"
          tint={""}
          alt="Description of my image"
        />
      )}
    </main>
  );
}
