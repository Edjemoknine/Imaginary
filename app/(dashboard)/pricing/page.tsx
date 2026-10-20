import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-80px)] max-w-7xl px-5 py-10 text-zinc-100 sm:px-8 sm:py-14">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
          Plans & pricing
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Choose how you create
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
          Upgrade to unlock AI-powered editing, or keep using the Basic tools for
          free.
        </p>
      </header>
      <PricingTable />
    </main>
  );
}
