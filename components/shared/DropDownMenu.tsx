import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import AddToAlbum from "./AddToAlbum";
import { serachResults } from "@/app/gallery/page";
import Link from "next/link";

const DropDownMenu = ({ className, image }: { className: string }) => {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"secondary"} asChild className="w-7 h-7 p-1">
            <Menu className="text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem asChild>
            <AddToAlbum image={image} />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              className="flex items-center cursor-pointer gap-2 p-1"
              href={`/edit?publicId=${encodeURIComponent(image?.public_id)}`}
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
