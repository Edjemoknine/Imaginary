import BrandLogo from "@/components/core/BrandLogo";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-[#f4f5ef] text-[#1f2825] lg:grid lg:grid-cols-2">
      <aside className="relative isolate flex min-h-[250px] flex-col justify-between overflow-hidden bg-[#1f2825] px-6 py-7 text-white sm:px-10 sm:py-9 lg:sticky lg:top-0 lg:h-screen lg:px-14 lg:py-12 xl:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-36 -z-10 h-[440px] w-[440px] rounded-full border border-white/[0.08] sm:h-[560px] sm:w-[560px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-20 -z-10 h-[340px] w-[340px] rounded-full border border-white/[0.08] sm:h-[450px] sm:w-[450px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_15%,rgba(245,139,61,0.28),transparent_42%),radial-gradient(ellipse_at_20%_85%,rgba(245,204,75,0.14),transparent_38%)]"
        />
        <Link href="/" className="w-fit" aria-label="Eido home">
          <BrandLogo size="landing" />
        </Link>

        <div className="my-12 max-w-xl lg:my-0 lg:py-16">
          <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ffd28a]">
            <Sparkles size={14} aria-hidden="true" />
            Your creative space
          </p>
          <h1 className="max-w-lg font-serif text-4xl font-normal leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Make room for what you imagine.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
            A thoughtful workspace to create, refine, and keep the images that
            feel like you.
          </p>
        </div>

        <p className="hidden text-xs tracking-wide text-white/45 lg:block">
          AI-powered image editing, made beautifully simple.
        </p>
      </aside>

      <section className="flex min-h-[calc(100vh-250px)] flex-col px-5 py-6 sm:px-10 sm:py-8 lg:min-h-screen lg:px-12 lg:py-10 xl:px-20">
        <div className="flex justify-end">
          <Link
            className="inline-flex items-center gap-1.5 text-sm text-[#66716a] transition-colors hover:text-[#1f2825]"
            href="/"
          >
            Back home
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[430px]">
            {children}
            <p className="mt-6 text-center text-xs tracking-wide text-[#89928b]">
              A little more clarity, every day.
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#9aa39d]">
          By continuing, you agree to use Eido thoughtfully.
        </p>
      </section>
    </main>
  );
}
