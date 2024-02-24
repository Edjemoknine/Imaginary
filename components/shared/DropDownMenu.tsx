import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

import AddToAlbum from "./AddToAlbum";
import { serachResults } from "@/app/gallery/page";

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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropDownMenu;
