"use client";
import CloudIMG from "@/components/shared/CloudIMG";
import { serachResults } from "../gallery/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FavoriteList = ({ resources }: { resources: serachResults[] }) => {
  const [resourcesState, setResourcesState] = useState(resources);
  const Router = useRouter();
  useEffect(() => {
    setResourcesState(resources);
  }, [resources]);

  return (
    <div className="columns-4 space-y-2 pt-10 gap-2 ">
      {resourcesState.map((img) => (
        <CloudIMG
          path="/favorite"
          width="400"
          alt="image"
          height="300"
          key={img.public_id}
          src={img.public_id}
          public_id={img.public_id}
          img={img}
          onUnheart={(unheartedResource:any) => {
            setResourcesState((currentResources:any) => {
              return currentResources.filter((resource:any) => {
                return resource.public_id !== unheartedResource.public_id;
              });
            });
          }}
        />
      ))}
    </div>
  );
};

export default FavoriteList;
