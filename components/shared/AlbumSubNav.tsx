import { Folder } from "@/app/album/page";
import React from "react";
import cloudinary from "cloudinary";
import { Button } from "../ui/button";
import Link from "next/link";

const AlbumSubNav = async () => {
  const { folders } = (await cloudinary.v2.api.root_folders()) as {
    folders: Folder[];
  };
  return (
    <>
      {folders.map((folder) => (
        <Button asChild variant={"ghost"} key={folder.name}>
          <Link href={`/album/${folder.path}`}>{folder.name}</Link>
        </Button>
      ))}
    </>
  );
};

export default AlbumSubNav;
