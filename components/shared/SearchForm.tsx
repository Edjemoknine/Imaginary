"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useGallerySearch } from "@/hooks/useGallerySearch";
import type { SearchFormProps } from "@/types/gallery";

const SearchForm = ({ initialState }: SearchFormProps) => {
  const { search, setSearch, submitSearch } = useGallerySearch(initialState);
  return (
    <form
      onSubmit={submitSearch}
      className="w-full rounded-2xl border border-white/[0.08] bg-[#141319] p-3 sm:max-w-md"
    >
      <Label
        htmlFor="gallery-search"
        className="text-[11px] font-medium text-zinc-400"
      >
        Search by tag
      </Label>
      <div className="mt-2 flex items-center gap-2">
        <Input
          id="gallery-search"
          onChange={(event) => setSearch(event.target.value)}
          value={search}
          placeholder="e.g. travel, portrait..."
          className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:border-brand/40 focus-visible:ring-brand/30 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          className="h-10 shrink-0 rounded-xl bg-brand px-4 text-xs font-semibold text-[#24100d] shadow-lg shadow-[#fa7052]/15 hover:bg-brand-200"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
