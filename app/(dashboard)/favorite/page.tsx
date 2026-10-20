import FavoriteList from "@/components/shared/FavoriteList";
import { getFavoriteImages } from "@/actions/gallery";

const Favorite = async () => {
  const results = await getFavoriteImages();

  return (
    <section className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-5 py-8 text-zinc-100 sm:px-8 sm:py-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
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
