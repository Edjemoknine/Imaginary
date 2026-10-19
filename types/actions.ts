export type DeleteImageResult =
  | { success: true }
  | { success: false; error: string };

export type AlbumOption = {
  name: string;
  path: string;
};

export type GetAlbumsResult =
  | { success: true; albums: AlbumOption[] }
  | { success: false; error: string };

export type AutoTagResult =
  | { success: true; tags: string[] }
  | { success: false; error: string };

export type SaveTransformedImageResult =
  | { success: true; publicId: string }
  | { success: false; error: string };
