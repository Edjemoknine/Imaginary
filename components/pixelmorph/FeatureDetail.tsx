"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Check, ChevronRight, Code2, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Feature, featureBySlug, features, imageUrl } from "./features";

const codeSamples = (feature: Feature) => ({
  URL: `https://res.cloudinary.com/<cloud-name>/image/upload/${feature.transformation}/sample.jpg`,
  React: `const imageUrl =\n  "https://res.cloudinary.com/<cloud-name>/image/upload/${feature.transformation}/sample.jpg";\n\nexport function EditedImage() {\n  return <img src={imageUrl} alt="Edited image" />;\n}`,
});

export default function FeatureDetail({ slug }: { slug: string }) {
  const feature = featureBySlug(slug);
  if (!feature) throw new Error(`No feature configured for slug "${slug}".`);

  const [tab, setTab] = useState<"URL" | "React">("URL");
  const [copied, setCopied] = useState(false);
  const Icon = feature.icon;
  const snippets = codeSamples(feature);

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippets[tab]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Unable to copy code snippet", error);
    }
  };

  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="relative">
          <Link href="/#features" className="inline-flex items-center gap-1 text-xs text-zinc-500 transition hover:text-zinc-200"><ChevronRight size={13} className="rotate-180" /> All features</Link>
          <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08] text-violet-200"><Icon size={21} /></div>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">PixelMorph AI feature</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{feature.title}, reimagined.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-zinc-400">{feature.detail}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild className="h-11 rounded-xl bg-violet-500 px-5 text-sm font-semibold text-white hover:bg-violet-400">
              <Link href={`/studio?tool=${feature.slug}`}>Try this tool <ArrowRight size={15} className="ml-2" /></Link>
            </Button>
            <a href="#developer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-zinc-300 transition hover:bg-white/[0.04]"><Code2 size={15} /> For developers</a>
          </div>
          <div className="mt-8 space-y-3">
            {["One-click editing in the studio", "Cloudinary-powered transformations", "Built for your creative workflow"].map((text) => <p key={text} className="flex items-center gap-2.5 text-sm text-zinc-400"><Check size={15} className="text-violet-300" />{text}</p>)}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141319] p-2.5 shadow-2xl shadow-black/40 sm:p-3">
          <div className="relative aspect-[1.25/1] overflow-hidden rounded-[20px]">
            <Image src={imageUrl(feature.image, 1400)} alt={feature.title} fill unoptimized sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/5" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-xs text-white backdrop-blur"><Sparkles size={13} className="text-violet-200" /> AI image editing</div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div><p className="text-xs text-white/65">Meet your new favorite tool</p><p className="mt-1 text-lg font-semibold text-white">{feature.shortTitle}</p></div>
              <span className="rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-xs text-white/80 backdrop-blur">Preview</span>
            </div>
          </div>
        </div>
      </section>

      <section id="developer" className="border-y border-white/[0.07] bg-[#0d0c12]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">For developers</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">One transformation. Your whole stack.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">Use Cloudinary’s image transformation URL in your existing workflow. Add your cloud name and source image to get started.</p>
            <Link href="/studio" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-300 transition hover:text-violet-200">Open the studio <ArrowRight size={15} /></Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101015]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] p-1">
                {(["URL", "React"] as const).map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-md px-3 py-1.5 text-xs transition ${tab === item ? "bg-white/[0.1] text-white" : "text-zinc-500 hover:text-zinc-200"}`}>{item}</button>)}
              </div>
              <button type="button" onClick={copySnippet} className="flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-white">{copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}{copied ? "Copied" : "Copy code"}</button>
            </div>
            <pre className="min-h-40 overflow-x-auto p-5 text-xs leading-6 text-violet-100 sm:p-6"><code>{snippets[tab]}</code></pre>
            <div className="border-t border-white/[0.08] px-5 py-3 text-[11px] text-zinc-600">Cloudinary transformation example · Replace placeholders with your Cloudinary configuration</div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-5 py-14 sm:flex-row sm:items-center sm:px-8 sm:py-16">
        <div><h2 className="text-2xl font-semibold text-white">Ready to make something?</h2><p className="mt-2 text-sm text-zinc-400">Bring your image into the PixelMorph studio.</p></div>
        <Button asChild className="h-11 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"><Link href="/studio">Try this tool <ArrowRight size={15} className="ml-2" /></Link></Button>
      </section>

      <section className="border-t border-white/[0.07] bg-[#0d0c12]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Explore more tools</p>
          <div className="mt-5 flex flex-wrap gap-2">{features.filter(({ slug }) => slug !== feature.slug).map((item) => <Link key={item.slug} href={`/features/${item.slug}`} className="rounded-full border border-white/10 px-3.5 py-2 text-xs text-zinc-400 transition hover:border-violet-400/30 hover:text-white">{item.shortTitle}</Link>)}</div>
        </div>
      </section>
    </main>
  );
}
