"use client";

import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "./DashboardSidebar";
import BrandLogo from "./BrandLogo";
import type { SiteShellProps } from "@/types/components";

function PixelMorphHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090c]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="Eido home">
          <BrandLogo size="landing" />
        </Link>
        <nav
          className="hidden items-center gap-8 text-sm text-zinc-400 md:flex"
          aria-label="Main navigation"
        >
          <Link className="transition hover:text-white" href="/#features">
            Features
          </Link>
          <Link className="transition hover:text-white" href="/#playground">
            Playground
          </Link>
          <Link className="transition hover:text-white" href="/#pricing">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="hidden text-sm font-medium text-zinc-300 transition hover:text-white sm:block"
          >
            Open studio
          </Link>
          <Button
            asChild
            className="h-9 rounded-lg bg-white px-4 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            <Link href="/studio">
              Start for free <ArrowUpRight className="ml-1.5" size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function PixelMorphFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#09090c]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/" className="flex items-center" aria-label="Eido home">
          <BrandLogo size="footer" />
        </Link>
        <p>AI-powered image editing, made beautifully simple.</p>
        <Link className="transition hover:text-white" href="/studio">
          Open the studio <span aria-hidden="true">→</span>
        </Link>
      </div>
    </footer>
  );
}

export default function SiteShell({
  children,
  variant = "dashboard",
}: SiteShellProps) {
  const { signOut } = useClerk();
  const pathname = usePathname();
  const pageTitle =
    pathname === "/studio"
      ? "AI Studio"
      : pathname.startsWith("/album")
        ? "Albums"
        : pathname.startsWith("/gallery")
          ? "Gallery"
          : pathname.startsWith("/favorite")
            ? "Favorites"
            : pathname.startsWith("/profile")
              ? "Profile"
              : pathname.startsWith("/pricing")
                ? "Plans & pricing"
              : pathname.startsWith("/features/")
                ? "AI Tools"
                : "Image workspace";

  if (variant === "landing") {
    return (
      <div className="min-h-screen bg-[#09090c] text-zinc-100">
        <PixelMorphHeader />
        {children}
        <PixelMorphFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090c] text-zinc-100">
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#09090c]/90 backdrop-blur-xl">
        <div className="flex h-20 w-full items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label="Eido home"
            >
              <BrandLogo />
            </Link>
            <span className="hidden h-6 w-px bg-white/10 sm:block" />
            <span className="truncate text-sm font-medium text-zinc-300">
              {pageTitle}
            </span>
          </div>
          <Button
            variant="outline"
            className="h-9 rounded-lg border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white"
            onClick={() => void signOut({ redirectUrl: "/" })}
          >
            <span className="hidden sm:inline">Sign out</span>
            <span className="sm:hidden">Logout</span>
            <LogOut className="ml-1.5" size={14} />
          </Button>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-80px)]">
        <DashboardSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
