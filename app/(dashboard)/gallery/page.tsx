import CloudIMG from "@/components/shared/CloudIMG";
import SearchForm from "@/components/shared/SearchForm";
import cloudinary from "cloudinary";
import { unstable_noStore } from "next/cache";
import type { SearchResult } from "@/types/gallery";
import type { GalleryPageProps } from "@/types/routes";
import { getImages } from "@/actions/gallery";
unstable_noStore();
const Gallery = async ({ searchParams }: GalleryPageProps) => {
  const { search = "" } = await searchParams;
  const searchTerm = Array.isArray(search) ? (search[0] ?? "") : search;
  const results = await getImages(searchTerm);
  return (
    <section className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-8 text-zinc-100 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
            Your library
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Gallery
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Browse and manage your Cloudinary images.
          </p>
        </div>
        <SearchForm initialState={searchTerm} />
      </div>

      {results?.resources.length ? (
        <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
          {results.resources.map((img) => (
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
          <h2 className="text-sm font-medium text-zinc-200">
            {searchTerm
              ? "No images match this tag"
              : "Your gallery is empty"}
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-5 text-zinc-500">
            {searchTerm
              ? "Try another tag or clear your search to see more images."
              : "Upload images to your Cloudinary account and they will appear here."}
          </p>
        </div>
      )}
    </section>
  );
};

export default Gallery;
