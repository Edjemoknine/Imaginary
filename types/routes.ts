export type GalleryPageProps = {
  searchParams: Promise<{
    search?: string | string[];
  }>;
};

export type AlbumPageProps = {
  params: Promise<{
    albumName: string;
  }>;
};
