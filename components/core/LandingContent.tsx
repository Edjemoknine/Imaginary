"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronRight,
  Eraser,
  ImagePlus,
  MoveHorizontal,
  Play,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { features, imageUrl, sampleImages } from "@/helpers/feature-catalog";
import { PricingTable } from "@clerk/nextjs";

const accent = "text-[#ff9a74]";
const border = "border-white/[0.09]";

function BeforeAfter() {
  const [position, setPosition] = useState(52);
  const image = imageUrl("photo-1470252649378-9c29740c9fa8", 1400);

  return (
    <div className="relative aspect-[1.22/1] w-full overflow-hidden rounded-[20px] bg-[#17171b] sm:aspect-[1.3/1]">
      <Image
        src={image}
        alt="Landscape before and after image enhancement"
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <Image
          src={image}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover saturate-150 contrast-110"
        />
      </div>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
        <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur">
          Original
        </span>
        <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur">
          Enhanced
        </span>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 top-0 z-10"
        style={{ left: `${position}%` }}
      >
        <div className="h-full w-px bg-white/90" />
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white text-zinc-900 shadow-xl">
          <MoveHorizontal size={16} />
        </div>
      </div>
      <input
        aria-label="Compare original and enhanced image"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
      />
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-[11px] text-white/90 backdrop-blur">
        <MoveHorizontal size={13} /> Drag to compare
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-xl">
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accent}`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}

export default function LandingContent() {
  const [selectedSample, setSelectedSample] = useState(0);
  const [effect, setEffect] = useState<"remove" | "fill" | "restore">("remove");
  const [demoRan, setDemoRan] = useState(false);
  const activeSample = sampleImages[selectedSample];

  const effectLabel = {
    remove: "Background removed",
    fill: "Generative fill applied",
    restore: "Image enhanced",
  }[effect];

  return (
    <main className="overflow-hidden">
      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px] overflow-hidden">
          <div className="absolute -left-48 top-10 h-[500px] w-[500px] rounded-full bg-[#fa7052]/[0.09] blur-[130px]" />
          <div className="absolute right-[-140px] top-20 h-[480px] w-[480px] rounded-full bg-[#f4ad63]/[0.07] blur-[140px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.035),transparent_65%)]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:min-h-[660px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-24">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ff9a74]/20 bg-[#ff9a74]/[0.07] px-3.5 py-2 text-xs font-medium text-[#ffc0a8]">
              <Sparkles size={14} /> A creative studio for every image
            </div>
            <h1 className="max-w-2xl text-[46px] font-semibold leading-[1.03] tracking-[-0.06em] text-white sm:text-6xl lg:text-[72px]">
              Make every image{" "}
              <span className="bg-gradient-to-r from-[#ffd18b] via-[#ff9b78] to-[#f7778e] bg-clip-text text-transparent">
                feel like yours.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Bring a good image closer to the one in your head. Remove,
              replace, restore, and expand with a few thoughtful tools.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="h-12 rounded-xl bg-[#ff9a74] px-6 text-sm font-semibold text-[#24100d] shadow-lg shadow-[#fa7052]/15 transition hover:bg-[#ffb08f]"
              >
                <Link href="/studio">
                  Open the studio <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
              <a
                href="#playground"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                <Play size={13} fill="currentColor" /> See what you can make
              </a>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-2">
                <Check size={14} className={accent} /> No editing experience
                needed
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={14} className={accent} /> Start with your own image
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[640px] lg:mr-0">
            <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-[#ff9068]/[0.12] via-transparent to-[#eb6e8d]/[0.10] blur-2xl" />
            <div
              className={`relative rounded-[28px] border ${border} bg-[#111115]/90 p-3 shadow-2xl shadow-black/50 sm:p-4`}
            >
              <div className="mb-3 flex items-center justify-between px-2 py-1.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-[#ffc0a8]">
                    <Sparkles size={15} />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-white">
                      Image preview
                    </p>
                    <p className="mt-0.5 text-[10px] text-zinc-500">
                      A little before, a little after
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-2.5 py-1 text-[10px] text-emerald-200">
                  Interactive
                </span>
              </div>
              <BeforeAfter />
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4 text-[11px] text-zinc-500">
                <span>Drag the handle to compare</span>
                <span className="inline-flex items-center gap-1.5 text-zinc-300">
                  <Zap size={12} className={accent} /> Made for the details
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#17171c] px-4 py-3 shadow-xl sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff9a74]/10 text-[#ffb18e]">
                <Wand2 size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-white">
                  One simple prompt
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-500">
                  A whole new direction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0d0d10]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 py-5 text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500 sm:justify-between sm:px-8">
          <span>Make room for your ideas</span>
          <span className="hidden h-1 w-1 rounded-full bg-[#ff9a74]/60 sm:block" />
          <span>Keep the details that matter</span>
          <span className="hidden h-1 w-1 rounded-full bg-[#ff9a74]/60 sm:block" />
          <span>Find a new point of view</span>
        </div>
      </section>

      <section id="features" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="A better starting point"
              title="The right edit is the one you had in mind."
              description="Five focused tools to help take an image from nearly there to unmistakably yours."
            />
            <Link
              href="/studio"
              className="mb-1 inline-flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-[#ffb18e]"
            >
              Explore the studio <ArrowDownRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {features.map(
              ({ slug, title, description, icon: Icon, image }, index) => (
                <Link
                  key={slug}
                  href={`/features/${slug}`}
                  className={`group relative min-h-[290px] overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#151518] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#ff9a74]/35 sm:p-6 ${index < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}
                >
                  <Image
                    src={imageUrl(image, 900)}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-[0.22] transition duration-700 group-hover:scale-105 group-hover:opacity-[0.34]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/65 to-[#101014]/10" />
                  <div className="relative flex min-h-[242px] flex-col">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-[#ffc0a8] backdrop-blur">
                      <Icon size={18} />
                    </span>
                    <div className="mt-auto">
                      <h3 className="text-lg font-semibold text-white">
                        {title}
                      </h3>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-300/75">
                        {description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#ffad8b]">
                        See what it can do{" "}
                        <ChevronRight
                          size={14}
                          className="transition group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="playground"
        className="scroll-mt-20 border-y border-white/[0.07] bg-[#0d0d10]"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Try a little something"
              title="Play with an idea before you commit."
              description="Choose a sample and an effect to preview the possibilities. When you’re ready, bring your own image into the studio."
            />
            <div className="mt-7">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Choose an image
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleImages.map((sample, index) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => {
                      setSelectedSample(index);
                      setDemoRan(false);
                    }}
                    aria-pressed={selectedSample === index}
                    className={`rounded-full border px-3.5 py-2 text-xs transition ${selectedSample === index ? "border-[#ff9a74]/40 bg-[#ff9a74]/[0.09] text-[#ffc0a8]" : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"}`}
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Choose an edit
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "remove", label: "Remove background", icon: Eraser },
                    { id: "fill", label: "Generative fill", icon: Wand2 },
                    { id: "restore", label: "Enhance", icon: ImagePlus },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setEffect(id);
                      setDemoRan(false);
                    }}
                    aria-pressed={effect === id}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition ${effect === id ? "border-[#ff9a74]/35 bg-[#ff9a74]/[0.08] text-white" : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"}`}
                  >
                    <Icon
                      size={14}
                      className={effect === id ? "text-[#ffb18e]" : ""}
                    />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="button"
              onClick={() => setDemoRan(true)}
              className="mt-6 h-11 rounded-xl bg-[#ff9a74] px-5 text-sm font-semibold text-[#24100d] hover:bg-[#ffb08f]"
            >
              <Sparkles size={15} className="mr-2" /> Preview this edit
            </Button>
          </div>

          <div className="rounded-[26px] border border-white/[0.09] bg-[#151518] p-3 shadow-2xl shadow-black/25 sm:p-4">
            <div className="mb-3 flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-[#ffad8b]" />
                Your canvas
              </div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                Sample preview
              </span>
            </div>
            <div className="relative aspect-[1.35/1] overflow-hidden rounded-[18px] bg-[#202024]">
              <Image
                src={imageUrl(activeSample.image, 1200)}
                alt={activeSample.alt}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={`object-cover transition duration-700 ${demoRan && effect === "restore" ? "saturate-150 contrast-110" : ""} ${demoRan && effect === "fill" ? "scale-110" : ""}`}
              />
              {demoRan && effect === "remove" && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#f27d63]/55 via-transparent to-transparent" />
              )}
              <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-xs text-white/90 backdrop-blur">
                {demoRan ? effectLabel : activeSample.name}
              </div>
              {demoRan && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-2 text-xs text-white backdrop-blur">
                  <Check size={14} className="text-emerald-300" /> Preview
                  applied
                </div>
              )}
            </div>
            <p className="px-2 pb-1 pt-3 text-[11px] text-zinc-500">
              A local visual preview · No upload or account required
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accent}`}
            >
              Simple pricing
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Start creating. Scale when ready.
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400 sm:text-base">
              Explore the studio for free. Choose a plan when you need more.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                suffix: "forever",
                description: "For curious creators.",
                items: [
                  "25 AI edits / month",
                  "All core AI tools",
                  "Standard exports",
                ],
                featured: false,
              },
              {
                name: "Pro",
                price: "$19",
                suffix: "per month",
                description: "For creators in their flow.",
                items: [
                  "1,000 AI edits / month",
                  "High-resolution exports",
                  "Commercial usage",
                  "Priority processing",
                ],
                featured: true,
              },
              {
                name: "Enterprise",
                price: "Let’s talk",
                suffix: "custom plan",
                description: "For teams at any scale.",
                items: [
                  "Custom edit volume",
                  "Team workspaces",
                  "API access & support",
                  "Dedicated success team",
                ],
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[22px] border p-6 sm:p-7 ${plan.featured ? "border-[#ff9a74]/35 bg-gradient-to-b from-[#ff9a74]/[0.08] to-[#141416] shadow-xl shadow-[#fa7052]/[0.05]" : "border-white/[0.08] bg-[#121215]"}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{plan.name}</h3>
                  {plan.featured && (
                    <span className="rounded-full bg-[#ff9a74]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#ffc0a8]">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-zinc-500">{plan.suffix}</span>
                </div>
                <Button
                  asChild
                  className={`mt-6 h-11 w-full rounded-xl ${plan.featured ? "bg-[#ff9a74] text-[#24100d] hover:bg-[#ffb08f]" : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"}`}
                  variant={plan.featured ? "default" : "outline"}
                >
                  <Link href="/studio">
                    {plan.name === "Enterprise"
                      ? "Contact sales"
                      : "Get started"}
                    <ArrowRight size={14} className="ml-2" />
                  </Link>
                </Button>
                <ul className="mt-6 space-y-3 border-t border-white/[0.08] pt-6">
                  {plan.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-zinc-400"
                    >
                      <Check size={15} className={`shrink-0 ${accent}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-7 text-center text-xs text-zinc-600">
            AI transformations are powered by Cloudinary. Plans shown are
            illustrative.
          </p>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#ff9a74]/20 bg-[#151316] px-6 py-12 text-center sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-36 h-80 w-80 rounded-full bg-[#fa7052]/10 blur-[100px]" />
          <div className="relative">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ff9a74]/20 bg-[#ff9a74]/[0.08] text-[#ffc0a8]">
              <Sparkles size={18} />
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Your next favorite image is one edit away.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-400">
              Bring an image into Eido and see where a small change can take it.
            </p>
            <Button
              asChild
              className="mt-7 h-12 rounded-xl bg-[#ff9a74] px-6 text-sm font-semibold text-[#24100d] hover:bg-[#ffb08f]"
            >
              <Link href="/studio">
                Make something yours <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
