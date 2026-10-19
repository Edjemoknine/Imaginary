import cloudinary from "cloudinary";
import { serachResults } from "../gallery/page";

import FavoriteList from "./FavoriteList";
const Favorite = async () => {
  const results = (await cloudinary.v2.search
    .expression("resource_type:image AND tags=favorite")
    .sort_by("created_at", "desc")
    .with_field("tags")
    .max_results(30)
    .execute()) as { resources: serachResults[] };

  return (
    <section className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-8 text-zinc-100 sm:px-8 sm:py-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
          Your library
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Favorite images
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Images you have saved for quick access.
        </p>
      </div>

      <FavoriteList resources={results.resources} />
    </section>
  );
};

export default Favorite;
