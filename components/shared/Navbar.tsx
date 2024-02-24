import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Album } from "lucide-react";

const Navbar = () => {
  return (
    <div className="container mx-auto border-b">
      <div className="flex h-16 items-center px-4">
        <div className="font-semibold text-xl flex gap-2 items-center">
          <Album size={35} className="text-blue-500" /> Imaginary
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
