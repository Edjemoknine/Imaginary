"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { buildGallerySearchUrl } from "@/helpers/gallery";

export function useGallerySearch(initialSearch: string) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.replace(buildGallerySearchUrl(search));
    router.refresh();
  };

  return {
    search,
    setSearch,
    submitSearch,
  };
}
