"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const SearchForm = ({ initialState }: { initialState: string }) => {
  const [search, setSearch] = useState(initialState);
  const router = useRouter();

  useEffect(() => {
    setSearch("");
  }, [initialState]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.replace(`/gallery?search=${encodeURIComponent(search)}`);
    router.refresh();
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full mt-4">
      <Label htmlFor="name" className=" text-right">
        Search By Tag
      </Label>
      <div className="flex items-center gap-3 mt-2">
        <Input
          id="name"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="col-span-3"
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
};

export default SearchForm;
