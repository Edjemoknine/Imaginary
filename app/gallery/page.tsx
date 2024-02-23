import CloudIMG from "@/components/shared/CloudIMG";
import UploadButton from "@/components/shared/UploadButton";
import cloudinary from "cloudinary";

export type serachResults = {
  public_id: string;
  tags: string[];
};
const Gallery = async () => {
  const results = (await cloudinary.v2.search
    .expression("resource_type:image")
    .sort_by("created_at", "desc")
    .with_field("tags")
    .max_results(4)
    .execute()) as { resources: serachResults[] };
  console.log(results);
  return (
    <section className="pt-7 px-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Gallery</h1>
        <UploadButton />
      </div>

      <div className="grid md:grid-cols-4 pt-10 gap-4 ">
        {results?.resources.map((img) => (
          <CloudIMG
            width="400"
            alt="image"
            height="300"
            key={img.public_id}
            src={img.public_id}
            public_id={img.public_id}
            img={img}
          />
        ))}
      </div>
    </section>
  );
};

export default Gallery;
