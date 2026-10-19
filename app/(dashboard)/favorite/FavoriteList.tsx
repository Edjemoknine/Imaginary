"use client";
import CloudIMG from "@/components/shared/CloudIMG";
import type { serachResults } from "../gallery/page";
import { useEffect, useState } from "react";

const FavoriteList = ({ resources }: { resources: serachResults[] }) => {
  const [resourcesState, setResourcesState] = useState(resources);
  useEffect(() => {
    setResourcesState(resources);
  }, [resources]);

  if (resourcesState.length === 0) {
    return (
      <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
        <h2 className="text-sm font-medium text-zinc-200">
          No favorites yet
        </h2>
        <p className="mt-1.5 max-w-sm text-xs leading-5 text-zinc-500">
          Tap the heart on an image in your gallery to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
      {resourcesState.map((img) => (
        <CloudIMG
          width="400"
          alt="image"
          height="300"
          key={img.public_id}
          public_id={img.public_id}
          img={img}
          onUnheart={(unheartedResource: serachResults) => {
            setResourcesState((currentResources) =>
              currentResources.filter(
                (resource) => resource.public_id !== unheartedResource.public_id,
              ),
            );
          }}
          onDelete={(deletedResource) => {
            setResourcesState((currentResources) =>
              currentResources.filter(
                (resource) => resource.public_id !== deletedResource.public_id,
              ),
            );
          }}
        />
      ))}
    </div>
  );
};

export default FavoriteList;
