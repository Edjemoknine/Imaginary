"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Album, Image, Heart, GalleryHorizontal } from "lucide-react";
export function Sidebar({}) {
  const pathname = usePathname();
  return (
    <div className={cn("pb-12 w-52")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname === "/gallery" && "secondary"}
              className="w-full justify-start"
            >
              <div>
                <Image size={18} className="mr-2" />

                <Link href={"/gallery"}>Gallery</Link>
              </div>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Browse
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button
              variant={pathname === "/album" && "secondary"}
              className="w-full justify-start"
            >
              <div className="flex gap-2">
                {/* <Heart size={18} className="mr-2" /> */}
                <Album size={18} className="" />
                <Link href={"/album"}>Albums</Link>
              </div>
            </Button>
            <Button
              asChild
              variant={pathname === "/favorite" && "secondary"}
              className="w-full justify-start"
            >
              <div>
                <Heart size={18} className="mr-2" />
                <Link href={"/favorite"}>Favorites</Link>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
