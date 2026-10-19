"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Album, ArrowUpRight, Heart, Image, Sparkles } from "lucide-react";
import { cn } from "@/helpers/cn";

const libraryLinks = [
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/album", label: "Albums", icon: Album },
  { href: "/favorite", label: "Favorites", icon: Heart },
];

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
      title={label}
      className={cn(
        "group flex h-11 shrink-0 items-center justify-center gap-3 rounded-xl px-2 text-[13px] font-medium transition md:justify-start md:px-3",
        active
          ? "bg-violet-400/[0.12] text-violet-100 ring-1 ring-inset ring-violet-300/15"
          : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100",
      )}
    >
      <Icon
        size={17}
        className={cn(
          "shrink-0 transition",
          active
            ? "text-violet-300"
            : "text-zinc-500 group-hover:text-zinc-300",
        )}
      />
      <span className="sr-only md:not-sr-only md:truncate">{label}</span>
    </Link>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isLibraryActive = (href: string) =>
    href === "/album" ? pathname.startsWith("/album") : pathname === href;

  return (
    <aside className="w-16 shrink-0 border-r border-white/[0.08] bg-[#0d0c11] md:min-h-[calc(100vh-80px)] md:w-[248px]">
      <nav
        aria-label="Dashboard"
        className="scrollbar-none sticky top-20 flex max-h-[calc(100vh-80px)] flex-col overflow-y-auto px-2 py-3 md:px-4 md:py-5"
      >
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex flex-col gap-1">
            <NavLink
              href="/studio"
              label="AI Studio"
              icon={Sparkles}
              active={pathname === "/studio"}
            />
          </div>

          <div className="mt-4 flex flex-col gap-1 md:mt-6">
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

          {/*   <div className="flex items-center gap-1.5 md:mt-6 md:flex-col md:items-stretch md:gap-1">
            <p className="hidden px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 md:block">
              AI tools
            </p>
            {features.map((feature) => (
              <NavLink
                key={feature.slug}
                href={`/features/${feature.slug}`}
                label={feature.shortTitle}
                icon={
                  toolIcons[feature.slug as keyof typeof toolIcons] ?? Sparkles
                }
                active={pathname === `/features/${feature.slug}`}
              />
            ))}
          </div> */}
        </div>

        <div className="mt-6 hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] to-fuchsia-500/[0.04] p-4 md:mt-auto md:block">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-violet-200">
            <Sparkles size={16} />
          </span>
          <p className="mt-3 text-xs font-semibold text-zinc-200">
            Make something amazing
          </p>
          <p className="mt-1.5 text-[11px] leading-5 text-zinc-500">
            Jump into the studio and bring your next idea to life.
          </p>
          <Link
            href="/studio"
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-violet-300 transition hover:text-violet-200"
          >
            Open studio <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>
    </aside>
  );
}
