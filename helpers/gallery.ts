export function buildGallerySearchUrl(search: string): string {
  const normalizedSearch = search.trim();
  return normalizedSearch
    ? `/gallery?search=${encodeURIComponent(normalizedSearch)}`
    : "/gallery";
}
