import CloudIMG from "@/components/shared/CloudIMG";
import UploadButton from "@/components/shared/UploadButton";
import cloudinary from "cloudinary";
import { AlbumCard } from "./albumCard";

export type serachResults = {
  public_id: string;
  tags: string[];
};

export type Folder = { name: string; path: string };
const Albums = async () => {
  const { folders } = (await cloudinary.v2.api.root_folders()) as {
    folders: Folder[];
  };

  return (
    <section className="pt-7 px-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Albums</h1>
      </div>

      <div className="grid grid-cols-3 pt-6 gap-3">
        {folders.map((folder, i) => (
          <AlbumCard key={i} folder={folder} />
        ))}
      </div>
    </section>
  );
};

export default Albums;
