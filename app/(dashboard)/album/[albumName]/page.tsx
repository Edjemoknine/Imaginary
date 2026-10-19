import CloudIMG from "@/components/shared/CloudIMG";
import UploadButton from "@/components/shared/UploadButton";
import cloudinary from "cloudinary";
import { FolderOpen } from "lucide-react";

export type serachResults = {
  public_id: string;
  tags: string[];
};
type Props = {
  params: {
    albumName: string;
  };
};
const Album = async ({ params: { albumName } }: Props) => {
  const results = await cloudinary.v2.search
    .expression(`resource_type:image AND folder=${albumName}`)
    .with_field("tags")
    .max_results(60)
    .execute();

  return (
    <section className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-8 text-zinc-100 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            Your library / Albums
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {albumName}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Images in this album.</p>
        </div>
      </div>

      {results?.resources.length ? (
        <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
          {results.resources.map((img: any) => (
            <CloudIMG
              width="400"
              alt={img.public_id}
              height="300"
              key={img.public_id}
              public_id={img.public_id}
              img={img}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08] text-violet-200">
            <FolderOpen size={21} />
          </span>
          <h2 className="mt-4 text-sm font-medium text-zinc-200">
            This album is empty
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-5 text-zinc-500">
            Upload an image and add it to this album to see it here.
          </p>
        </div>
      )}
    </section>
  );
};

export default Album;
