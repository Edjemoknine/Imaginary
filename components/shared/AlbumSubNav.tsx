import cloudinary from "cloudinary";
import { Button } from "../ui/button";
import Link from "next/link";
import type { AlbumFolder } from "@/types/albums";

const AlbumSubNav = async () => {
  const { folders } = (await cloudinary.v2.api.root_folders()) as {
    folders: AlbumFolder[];
  };
  return (
    <>
      {folders.map((folder) => (
        <Button asChild variant={"ghost"} key={folder?.name}>
          <Link href={`/album/${folder?.path}`}>{folder?.name}</Link>
        </Button>
      ))}
    </>
  );
};

export default AlbumSubNav;
