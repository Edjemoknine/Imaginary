"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CldImage } from "next-cloudinary";
import { useState } from "react";

type Props = {
  searchParams: {
    publicId: string;
  };
};
const Edit = ({ searchParams: { publicId } }: Props) => {
  const [Transformation, setTransformation] = useState("");
  const [prompt, setPrompt] = useState<string>("");
  return (
    <section className="pt-7 px-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Edit {publicId}</h1>
      </div>
      <div className="mt-6 mb-4 flex items-center gap-4">
        <Button
          onClick={() => setTransformation("")}
          className="mb-4"
          variant={"default"}
        >
          Clear
        </Button>
        <Button
          onClick={() => setTransformation("generative-fill")}
          className="mb-4"
          variant={"secondary"}
        >
          Genertive Fill
        </Button>

        <Button
          onClick={() => setTransformation("blur")}
          className="mb-4"
          variant={"outline"}
        >
          Blur
        </Button>
        <Button
          onClick={() => setTransformation("GrayScale")}
          className="mb-4"
          variant={"outline"}
        >
          GryScale
        </Button>
        <Button
          onClick={() => setTransformation("removeBackground")}
          className="mb-4"
          variant={"outline"}
        >
          Remove Background
        </Button>
        <Button
          onClick={() => setTransformation("pixelate")}
          className="mb-4"
          variant={"outline"}
        >
          pixelate
        </Button>
        <Button
          onClick={() => setTransformation("Tint")}
          className="mb-4"
          variant={"outline"}
        >
          Tint
        </Button>
        <Button
          onClick={() => setTransformation("opacity")}
          className="mb-4"
          variant={"outline"}
        >
          opacity
        </Button>
      </div>
      <div>
        <Input
          type="text"
          value={prompt}
          className="max-w-xl w-full mb-4"
          placeholder="Add Prompt to Generate to add things"
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-10">
        <CldImage alt="Image" width="700" height="900" src={publicId} />
        {Transformation === "generative-fill" && (
          <CldImage
            src={publicId}
            alt="Image"
            width="700"
            height="900"
            fillBackground={{
              prompt,
            }}
            crop="pad"
          />
        )}
        {Transformation === "Tint" && (
          <CldImage
            src={publicId}
            alt="Image"
            width="700"
            height="900"
            tint="equalize:80:blue:blueviolet"
          />
        )}
        {Transformation === "blur" && (
          <CldImage
            src={publicId}
            alt="Image"
            width="700"
            height="900"
            blur="800"
          />
        )}
        {Transformation === "GrayScale" && (
          <CldImage
            src={publicId}
            alt="Image"
            width="700"
            height="900"
            grayscale="800"
          />
        )}
        {Transformation === "removeBackground" && (
          <CldImage
            src={publicId}
            alt="Image"
            width="700"
            height="900"
            removeBackground
          />
        )}
        {Transformation === "opacity" && (
          <CldImage
            src={publicId}
            alt="Image"
            width="700"
            height="900"
            opacity="50"
          />
        )}
        {Transformation === "pixelate" && (
          <CldImage
            src={publicId}
            alt="Image"
            width="700"
            height="900"
            pixelate
          />
        )}
      </div>
    </section>
  );
};

export default Edit;
