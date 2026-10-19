import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { FolderPlus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import AddToAlbum from "./AddToAlbum";
import type { SearchResult } from "@/types/gallery";
import Link from "next/link";
import DeleteImageDialog from "./DeleteImageDialog";

const DropDownMenu = ({
  className,
  image,
  onDeleted,
}: {
  image: SearchResult;
  className: string;
  onDeleted: () => void;
}) => {
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-white shadow-lg backdrop-blur-md transition hover:border-brand-300/30 hover:bg-black/60 ${className}`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Image actions"
              className="flex h-full w-full items-center justify-center rounded-xl text-current outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <MoreHorizontal size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44 rounded-xl border-white/10 bg-[#141319] p-1.5 text-zinc-200 shadow-2xl shadow-black/40">
            <DropdownMenuItem
              onSelect={() => setIsAlbumDialogOpen(true)}
              className="cursor-pointer rounded-lg text-xs focus:bg-brand/10 focus:text-brand-100"
            >
              <span className="flex items-center gap-2 p-1">
                <FolderPlus size={15} />
                Add to album
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg text-xs focus:bg-brand/10 focus:text-brand-100"
            >
              <Link
                className="flex items-center gap-2 p-1"
                href={`/studio?publicId=${encodeURIComponent(image.public_id)}`}
              >
                <Pencil size={15} className="ml-0.5" /> Edit in Studio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setIsDeleteDialogOpen(true)}
              className="cursor-pointer rounded-lg text-xs text-rose-300 focus:bg-rose-400/10 focus:text-rose-200"
            >
              <span className="flex items-center gap-2 p-1">
                <Trash2 size={15} />
                Delete image
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AddToAlbum
        image={image}
        open={isAlbumDialogOpen}
        onOpenChange={setIsAlbumDialogOpen}
      />
      <DeleteImageDialog
        image={image}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleted={onDeleted}
      />
    </>
  );
};

export default DropDownMenu;
