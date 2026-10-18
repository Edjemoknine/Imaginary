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
    <section className="pt-7 px-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Favorite Images</h1>
      </div>

      <FavoriteList resources={results.resources} />
    </section>
  );
};

export default Favorite;
