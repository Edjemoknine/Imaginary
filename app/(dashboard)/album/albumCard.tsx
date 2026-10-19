import { Button } from "@/components/ui/button";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import type { AlbumFolder } from "@/types/albums";
import Link from "next/link";

export function AlbumCard({ folder }: { folder: AlbumFolder }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141319] transition hover:-translate-y-0.5 hover:border-violet-400/25">
      <div className="flex items-start justify-between gap-4 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.08] text-violet-200 transition group-hover:bg-violet-400/[0.12]">
          <FolderOpen size={20} />
        </span>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-zinc-500">
          Album
        </span>
      </div>
      <div className="px-5 pb-5">
        <h2 className="truncate text-base font-semibold text-white">
          {folder.name}
        </h2>
        <p className="mt-1 truncate text-xs text-zinc-500">
          All your {folder.name} images
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-5 h-10 w-full justify-between rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-200 hover:border-violet-400/25 hover:bg-violet-400/[0.06] hover:text-white"
        >
          <Link href={`/album/${encodeURIComponent(folder.name)}`}>
            View album <ArrowUpRight size={15} />
          </Link>
        </Button>
      </div>
    </article>
  );
}
