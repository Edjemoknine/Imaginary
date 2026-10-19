"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import type { serachResults } from "@/app/(dashboard)/gallery/page";
import { AddImageToAlbum } from "@/components/shared/actions";

type Props = {
  image: serachResults;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddToAlbum = ({ image, open, onOpenChange }: Props) => {
  const [albumName, setAlbumName] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-white/[0.08] bg-[#141319] p-0 text-zinc-100 shadow-2xl shadow-black/50 sm:max-w-[440px]">
        <DialogHeader>
          <div className="border-b border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] to-fuchsia-500/[0.04] p-5 pr-12">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.08] text-violet-200">
              <FolderPlus size={18} />
            </span>
            <DialogTitle className="mt-4 text-base font-semibold text-white">
              Add to album
            </DialogTitle>
            <DialogDescription className="mt-2 text-xs leading-5 text-zinc-400">
              Enter an album name to organize this image in your library.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="p-5">
          <div className="space-y-2">
            <Label htmlFor="album-name" className="text-xs font-medium text-zinc-300">
              Album name
            </Label>
            <Input
              id="album-name"
              onChange={(event) => setAlbumName(event.target.value)}
              value={albumName}
              placeholder="e.g. Travel, portraits..."
              className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:border-violet-400/40 focus-visible:ring-violet-400/30 focus-visible:ring-offset-0"
            />
          </div>
          <DialogFooter className="mt-6 gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={async () => {
                onOpenChange(false);
                await AddImageToAlbum(albumName.trim(), image);
              }}
              type="button"
              disabled={!albumName.trim()}
              className="h-10 rounded-xl bg-violet-500 px-4 text-xs font-semibold text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400"
            >
              Add to album
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToAlbum;
