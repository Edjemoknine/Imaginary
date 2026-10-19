import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil } from "lucide-react";
import AddToAlbum from "./AddToAlbum";
import { serachResults } from "@/app/(dashboard)/gallery/page";
import Link from "next/link";

const DropDownMenu = ({ className, image }: { image: any; className: string }) => {
  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/40 shadow-lg backdrop-blur-md transition hover:border-violet-300/30 hover:bg-black/60 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Image actions"
            className="flex h-full w-full items-center justify-center rounded-xl text-current outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <MoreHorizontal size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 rounded-xl border-white/10 bg-[#141319] p-1.5 text-zinc-200 shadow-2xl shadow-black/40">
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-xs focus:bg-violet-400/10 focus:text-violet-100">
            <AddToAlbum image={image} />
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-xs focus:bg-violet-400/10 focus:text-violet-100">
            <Link
              className="flex items-center gap-2 p-1"
              href={`/studio?publicId=${encodeURIComponent(image?.public_id)}`}
            >
              <Pencil size={17} className="  h-4 w-4 -ml-1" /> Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropDownMenu;
