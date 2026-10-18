"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Album,
  ArrowUpRight,
  Eraser,
  Expand,
  Heart,
  Image,
  ImagePlus,
  ScanFace,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { features } from "./features";

const libraryLinks = [
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/album", label: "Albums", icon: Album },
  { href: "/favorite", label: "Favorites", icon: Heart },
  { href: "/edit", label: "Image editor", icon: Wand2 },
];

const toolIcons = {
  "background-removal": ScanFace,
  "generative-fill": Expand,
  "object-removal": Eraser,
  "generative-replace": Wand2,
  "image-restoration": ImagePlus,
} as const;

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Sparkles;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition",
        active
          ? "bg-violet-400/[0.12] text-violet-100 ring-1 ring-inset ring-violet-300/15"
          : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100",
      )}
    >
      <Icon
        size={17}
        className={cn(
          "shrink-0 transition",
          active ? "text-violet-300" : "text-zinc-500 group-hover:text-zinc-300",
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isLibraryActive = (href: string) =>
    href === "/album" ? pathname.startsWith("/album") : pathname === href;

  return (
    <aside className="border-b border-white/[0.08] bg-[#0d0c11] md:min-h-[calc(100vh-72px)] md:w-[248px] md:shrink-0 md:border-b-0 md:border-r">
      <nav aria-label="Dashboard" className="scrollbar-none overflow-x-auto px-3 py-3 md:sticky md:top-[72px] md:flex md:max-h-[calc(100vh-72px)] md:flex-col md:overflow-y-auto md:px-4 md:py-5">
        <div className="flex min-w-max gap-2 md:min-w-0 md:flex-col md:gap-0">
          <div className="flex items-center gap-2 px-2 pb-2 md:pb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              <Sparkles size={15} />
            </span>
            <span className="text-xs font-semibold tracking-wide text-zinc-300">WORKSPACE</span>
          </div>

          <div className="flex gap-1.5 md:flex-col md:gap-1">
            <NavLink
              href="/studio"
              label="AI Studio"
              icon={Sparkles}
              active={pathname === "/studio"}
            />
          </div>

          <div className="flex items-center gap-1.5 md:mt-6 md:flex-col md:items-stretch md:gap-1">
            <p className="hidden px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 md:block">
              Your library
            </p>
            {libraryLinks.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={icon}
                active={isLibraryActive(href)}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 md:mt-6 md:flex-col md:items-stretch md:gap-1">
            <p className="hidden px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 md:block">
              AI tools
            </p>
            {features.map((feature) => (
              <NavLink
                key={feature.slug}
                href={`/features/${feature.slug}`}
                label={feature.shortTitle}
                icon={toolIcons[feature.slug as keyof typeof toolIcons] ?? Sparkles}
                active={pathname === `/features/${feature.slug}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] to-fuchsia-500/[0.04] p-4 md:block">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-violet-200">
            <Sparkles size={16} />
          </span>
          <p className="mt-3 text-xs font-semibold text-zinc-200">Make something amazing</p>
          <p className="mt-1.5 text-[11px] leading-5 text-zinc-500">Jump into the studio and bring your next idea to life.</p>
          <Link href="/studio" className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-violet-300 transition hover:text-violet-200">
            Open studio <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>
    </aside>
  );
}
