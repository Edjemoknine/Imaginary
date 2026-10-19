import cloudinary from "cloudinary";
import { AlbumCard } from "./albumCard";
import { FolderOpen } from "lucide-react";

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
    <section className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-8 text-zinc-100 sm:px-8 sm:py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            Your library
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Albums
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Keep your images organized in one place.
          </p>
        </div>
      </div>

      {folders.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {folders.map((folder) => (
            <AlbumCard key={folder.path} folder={folder} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08] text-violet-200">
            <FolderOpen size={21} />
          </span>
          <h2 className="mt-4 text-sm font-medium text-zinc-200">
            No albums yet
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-5 text-zinc-500">
            Create an album when adding an image to start organizing your
            library.
          </p>
        </div>
      )}
    </section>
  );
};

export default Albums;
