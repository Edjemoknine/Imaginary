import CloudIMG from "@/components/shared/CloudIMG";
import UploadButton from "@/components/shared/UploadButton";
import cloudinary from "cloudinary";

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
    <section className="pt-7 px-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Album {albumName}</h1>
        <UploadButton />
      </div>

      <div className="md:columns-4 columns-2 space-y-2 pt-10 gap-2 ">
        {results?.resources.map((img: any) => (
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

export default Album;
