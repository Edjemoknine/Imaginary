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
import { FolderPlus, Loader2, Plus, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import type { ImageDialogProps } from "@/types/components";
import {
  addImageToAlbum,
  getAlbumNames,
} from "@/actions/media";
import type { AlbumOption } from "@/types/actions";
import { useRouter } from "next/navigation";

const CREATE_ALBUM_VALUE = "__create_new_album__";

const AddToAlbum = ({ image, open, onOpenChange }: ImageDialogProps) => {
  const [albums, setAlbums] = useState<AlbumOption[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState(CREATE_ALBUM_VALUE);
  const [albumName, setAlbumName] = useState("");
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(false);
  const [albumLoadFailed, setAlbumLoadFailed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const refreshAlbums = useCallback(
    async (isCurrent: () => boolean = () => true) => {
      setIsLoadingAlbums(true);
      setAlbumLoadFailed(false);
      try {
        const result = await getAlbumNames();
        if (!isCurrent()) return;

        if (result.success) {
          setAlbums(result.albums);
          setErrorMessage("");
        } else {
          setAlbumLoadFailed(true);
          setErrorMessage(result.error);
        }
      } catch (error) {
        if (!isCurrent()) return;
        setAlbumLoadFailed(true);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not load your albums.",
        );
      } finally {
        if (isCurrent()) setIsLoadingAlbums(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!open) return;

    let isCurrent = true;
    setSelectedAlbum(CREATE_ALBUM_VALUE);
    setAlbumName("");
    setErrorMessage("");
    void refreshAlbums(() => isCurrent);

    return () => {
      isCurrent = false;
    };
  }, [open, refreshAlbums]);

  const addImage = async () => {
    const destinationAlbum =
      selectedAlbum === CREATE_ALBUM_VALUE
        ? albumName.trim()
        : albums.find((album) => `album:${album.path}` === selectedAlbum)?.name;

    if (!destinationAlbum) {
      setErrorMessage("Choose an album or enter a name for a new album.");
      return;
    }

    setIsAdding(true);
    setErrorMessage("");
    try {
      await addImageToAlbum(destinationAlbum, image);
      setAlbumName("");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not add the image to the album.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isAdding) onOpenChange(nextOpen);
      }}
    >
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
              Select an existing album or create one for this image.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="p-5">
          <div className="space-y-2">
            <Label
              htmlFor="album-destination"
              className="text-xs font-medium text-zinc-300"
            >
              Choose album
            </Label>
            <Select
              value={selectedAlbum}
              onValueChange={(value) => {
                setSelectedAlbum(value);
                setErrorMessage("");
              }}
            >
              <SelectTrigger
                id="album-destination"
                className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-100 focus:ring-violet-400/30 focus:ring-offset-0"
              >
                <SelectValue placeholder="Select an album" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/10 bg-[#141319] text-zinc-100">
                <SelectItem
                  value={CREATE_ALBUM_VALUE}
                  className="text-xs focus:bg-violet-400/10 focus:text-violet-100"
                >
                  <span className="flex items-center gap-2">
                    <Plus size={14} className="text-violet-300" />
                    Create a new album
                  </span>
                </SelectItem>
                {albums.map((album) => {
                  const isCurrentAlbum = image.public_id.startsWith(
                    `${album.name}/`,
                  );
                  return (
                    <SelectItem
                      key={album.path}
                      value={`album:${album.path}`}
                      disabled={isCurrentAlbum}
                      className="text-xs focus:bg-violet-400/10 focus:text-violet-100"
                    >
                      {album.name}
                      {isCurrentAlbum ? " (current album)" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedAlbum === CREATE_ALBUM_VALUE && (
              <Input
                id="album-name"
                autoFocus
                onChange={(event) => {
                  setAlbumName(event.target.value);
                  setErrorMessage("");
                }}
                value={albumName}
                placeholder="e.g. Travel, portraits..."
                className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-100 placeholder:text-zinc-600 focus-visible:border-violet-400/40 focus-visible:ring-violet-400/30 focus-visible:ring-offset-0"
              />
            )}
            {isLoadingAlbums && (
              <p className="flex items-center gap-2 text-[11px] text-zinc-500">
                <Loader2 size={12} className="animate-spin" />
                Loading your albums…
              </p>
            )}
            {!isLoadingAlbums && albums.length === 0 && !errorMessage && (
              <p className="text-[11px] leading-5 text-zinc-500">
                No albums yet. Create one by entering a name above.
              </p>
            )}
          </div>
          {errorMessage && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3 py-2 text-xs leading-5 text-rose-200"
            >
              {errorMessage}
              {!isLoadingAlbums && albumLoadFailed && (
                <button
                  type="button"
                  onClick={() => void refreshAlbums()}
                  className="ml-2 inline-flex items-center gap-1 font-medium text-rose-100 underline underline-offset-2"
                >
                  <RefreshCw size={11} /> Retry
                </button>
              )}
            </p>
          )}
          <DialogFooter className="mt-6 gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isAdding}
                className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => void addImage()}
              type="button"
              disabled={
                isAdding ||
                isLoadingAlbums ||
                (selectedAlbum === CREATE_ALBUM_VALUE && !albumName.trim())
              }
              className="h-10 rounded-xl bg-violet-500 px-4 text-xs font-semibold text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400"
            >
              {isAdding && <Loader2 size={14} className="mr-2 animate-spin" />}
              {isAdding
                ? "Adding…"
                : selectedAlbum === CREATE_ALBUM_VALUE
                  ? "Create album & add image"
                  : "Add to album"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToAlbum;
