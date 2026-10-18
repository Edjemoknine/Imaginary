"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "./DashboardSidebar";

function PixelMorphHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090c]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="PixelMorph AI home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-950/30">
            <Sparkles size={19} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-white">
            PixelMorph <span className="text-violet-300">AI</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex" aria-label="Main navigation">
          <Link className="transition hover:text-white" href="/#features">Features</Link>
          <Link className="transition hover:text-white" href="/#playground">Playground</Link>
          <Link className="transition hover:text-white" href="/#pricing">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/studio" className="hidden text-sm font-medium text-zinc-300 transition hover:text-white sm:block">
            Open studio
          </Link>
          <Button asChild className="h-9 rounded-lg bg-white px-4 text-xs font-semibold text-zinc-950 hover:bg-zinc-200">
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
        <Link href="/" className="flex items-center gap-2 font-medium text-zinc-300">
          <Sparkles size={16} className="text-violet-400" /> PixelMorph AI
        </Link>
        <p>AI-powered image editing, made beautifully simple.</p>
        <Link className="transition hover:text-white" href="/studio">Open the studio <span aria-hidden="true">→</span></Link>
      </div>
    </footer>
  );
}

type SiteShellProps = {
  children: React.ReactNode;
  variant?: "landing" | "dashboard";
};

export default function SiteShell({ children, variant = "dashboard" }: SiteShellProps) {
  const pathname = usePathname();

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
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090c]/90 backdrop-blur-xl">
        <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="PixelMorph AI home">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-950/30">
                <Sparkles size={19} />
              </span>
              <span className="hidden text-[16px] font-semibold tracking-tight text-white sm:block">
                PixelMorph <span className="text-violet-300">AI</span>
              </span>
            </Link>
            <span className="hidden h-6 w-px bg-white/10 sm:block" />
            <span className="truncate text-sm font-medium text-zinc-300">
              {pathname === "/studio"
                ? "AI Studio"
                : pathname.startsWith("/features/")
                  ? "AI Tools"
                  : "Image workspace"}
            </span>
          </div>
          <Button asChild variant="outline" className="h-9 rounded-lg border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white">
            <Link href="/">
              <span className="hidden sm:inline">Back to website</span>
              <span className="sm:hidden">Website</span>
              <ArrowUpRight className="ml-1.5" size={14} />
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <DashboardSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
