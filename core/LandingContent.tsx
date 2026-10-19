"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowDown,
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

function BeforeAfter() {
  const [position, setPosition] = useState(52);
  const original = imageUrl("photo-1470252649378-9c29740c9fa8", 1400);
  const enhanced = original;

  return (
    <div className="relative aspect-[1.17/1] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 sm:aspect-[1.25/1]">
      <Image src={original} alt="Before: original landscape photograph" fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <Image src={enhanced} alt="After: AI-enhanced landscape photograph" fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover saturate-150 contrast-110" />
      </div>
      <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-medium backdrop-blur">Original</span>
      <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-medium backdrop-blur">AI enhanced</span>
      <div className="pointer-events-none absolute bottom-0 top-0 z-10" style={{ left: `${position}%` }}>
        <div className="h-full w-px bg-white/90" />
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white text-zinc-900 shadow-xl">
          <MoveHorizontal size={17} />
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
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs text-white/85 backdrop-blur">
        <MoveHorizontal size={14} /> Drag to compare
      </div>
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
      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
        <div className="pointer-events-none absolute -left-36 top-12 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="relative">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3.5 py-2 text-xs font-medium text-violet-200">
            <Sparkles size={14} className="text-violet-300" /> AI image editing, reimagined
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.07] tracking-[-0.055em] text-white sm:text-6xl lg:text-[68px]">
            Transform images instantly with{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">generative AI.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Go from “almost there” to “exactly right.” Create, remove, expand, and enhance images with Cloudinary-powered AI.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className="h-12 rounded-xl bg-violet-500 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 hover:bg-violet-400">
              <Link href="/studio">Start editing free <ArrowRight className="ml-2" size={16} /></Link>
            </Button>
            <a href="#playground" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.04]">
              <Play size={14} fill="currentColor" /> Explore the demo
            </a>
          </div>
          <div className="mt-8 flex items-center gap-3 text-xs text-zinc-500">
            <div className="flex -space-x-2">
              {["photo-1534528741775-53994a69daeb", "photo-1500648767791-00dcc994a43e", "photo-1531123897727-8f129e1688ce"].map((image) => (
                <Image key={image} src={imageUrl(image, 80)} alt="" width={28} height={28} unoptimized className="h-7 w-7 rounded-full border-2 border-[#09090c] object-cover" />
              ))}
            </div>
            <span><strong className="font-medium text-zinc-300">Loved by creative teams</strong> around the world</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[590px]">
          <div className="absolute -inset-6 rounded-[34px] bg-gradient-to-br from-violet-500/15 via-transparent to-fuchsia-500/10 blur-2xl" />
          <div className="relative rounded-[26px] border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/50">
            <div className="mb-3 flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2 text-xs text-zinc-400"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Live preview</div>
              <span className="rounded-md bg-white/[0.06] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-zinc-500">Generative fill</span>
            </div>
            <BeforeAfter />
            <div className="flex items-center justify-between px-2 pb-1 pt-4 text-xs">
              <span className="text-zinc-400">Extend the scene beyond the frame</span>
              <span className="flex items-center gap-1 text-violet-300">Made with AI <Sparkles size={12} /></span>
            </div>
          </div>
          <div className="absolute -bottom-7 -left-5 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#141319] px-4 py-3 shadow-xl sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Zap size={17} /></div>
            <div><p className="text-xs font-medium text-white">Ready in seconds</p><p className="mt-0.5 text-[10px] text-zinc-500">No editing skills required</p></div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-white/[0.07] bg-[#0d0c12]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Your creative toolkit</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Every edit. A little more magic.</h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400 sm:text-base">Powerful AI tools that fit into the way you already create.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {features.map(({ slug, title, description, icon: Icon, image }, index) => (
              <Link key={slug} href={`/features/${slug}`} className={`group relative min-h-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141319] p-6 transition hover:-translate-y-1 hover:border-violet-400/30 ${index < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}>
                <Image src={imageUrl(image, 800)} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-[0.14] transition duration-500 group-hover:scale-105 group-hover:opacity-[0.24]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111015] via-[#111015]/75 to-transparent" />
                <div className="relative flex h-full min-h-52 flex-col">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-violet-200"><Icon size={19} /></span>
                  <div className="mt-auto">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">{description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-violet-300">Explore feature <ChevronRight size={14} className="transition group-hover:translate-x-1" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="playground" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Playground</p>
          <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight text-white sm:text-4xl">A little preview. A lot of possibility.</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">Choose a sample, pick an effect, and see how quickly an idea can become an image. This interactive demo runs locally in your browser.</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {sampleImages.map((sample, index) => (
              <button key={sample.name} type="button" onClick={() => { setSelectedSample(index); setDemoRan(false); }} className={`rounded-full border px-3.5 py-2 text-xs transition ${selectedSample === index ? "border-violet-400/50 bg-violet-400/10 text-violet-200" : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"}`}>
                {sample.name}
              </button>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {([
              { id: "remove", label: "Remove background", icon: Eraser },
              { id: "fill", label: "Generative fill", icon: Wand2 },
              { id: "restore", label: "Enhance", icon: ImagePlus },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => { setEffect(id); setDemoRan(false); }} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition ${effect === id ? "border-violet-400/40 bg-violet-500/10 text-white" : "border-white/10 text-zinc-400 hover:text-white"}`}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>
          <Button type="button" onClick={() => setDemoRan(true)} className="mt-5 h-11 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
            <Sparkles size={15} className="mr-2" /> Try this effect
          </Button>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141319] p-3 sm:p-4">
          <div className="relative aspect-[1.4/1] overflow-hidden rounded-2xl bg-zinc-900">
            <Image src={imageUrl(activeSample.image, 1200)} alt={activeSample.alt} fill unoptimized sizes="(max-width: 1024px) 100vw, 55vw" className={`object-cover transition duration-700 ${demoRan && effect === "restore" ? "saturate-150 contrast-110" : ""} ${demoRan && effect === "fill" ? "scale-110" : ""}`} />
            {demoRan && effect === "remove" && <div className="absolute inset-0 bg-gradient-to-t from-violet-950/55 via-transparent to-transparent" />}
            <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/45 px-3 py-1.5 text-xs text-white/80 backdrop-blur">{demoRan ? effectLabel : "Your preview"}</div>
            {demoRan && <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-emerald-300/25 bg-black/55 px-3 py-2 text-xs text-emerald-200 backdrop-blur"><Check size={14} /> Demo preview</div>}
          </div>
          <p className="px-2 pb-1 pt-3 text-xs text-zinc-500">Sample edit · No upload or account required</p>
        </div>
      </section>

      <section id="pricing" className="border-t border-white/[0.07] bg-[#0d0c12]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Simple pricing</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Start creating. Scale when ready.</h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400">Explore the studio for free. Choose a plan when you need more.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Free", price: "$0", suffix: "forever", description: "For curious creators.", items: ["25 AI edits / month", "All core AI tools", "Standard exports"], featured: false },
              { name: "Pro", price: "$19", suffix: "per month", description: "For creators in their flow.", items: ["1,000 AI edits / month", "High-resolution exports", "Commercial usage", "Priority processing"], featured: true },
              { name: "Enterprise", price: "Let’s talk", suffix: "custom plan", description: "For teams at any scale.", items: ["Custom edit volume", "Team workspaces", "API access & support", "Dedicated success team"], featured: false },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl border p-6 sm:p-7 ${plan.featured ? "border-violet-400/40 bg-gradient-to-b from-violet-500/[0.12] to-[#141319] shadow-xl shadow-violet-950/20" : "border-white/[0.08] bg-[#141319]"}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{plan.name}</h3>
                  {plan.featured && <span className="rounded-full bg-violet-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-200">Popular</span>}
                </div>
                <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-2"><span className="text-3xl font-semibold tracking-tight text-white">{plan.price}</span><span className="text-xs text-zinc-500">{plan.suffix}</span></div>
                <Button asChild className={`mt-6 h-11 w-full rounded-xl ${plan.featured ? "bg-violet-500 text-white hover:bg-violet-400" : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"}`} variant={plan.featured ? "default" : "outline"}>
                  <Link href="/studio">{plan.name === "Enterprise" ? "Contact sales" : "Get started"} <ArrowRight size={14} className="ml-2" /></Link>
                </Button>
                <ul className="mt-6 space-y-3 border-t border-white/[0.08] pt-6">
                  {plan.items.map((item) => <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-400"><Check size={15} className="shrink-0 text-violet-300" />{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-7 text-center text-xs text-zinc-600">AI transformations are powered by Cloudinary. Plans shown are illustrative.</p>
        </div>
      </section>
      <a href="#features" aria-label="Back to features" className="sr-only"><ArrowDown /></a>
    </main>
  );
}
