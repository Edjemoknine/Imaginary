"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  ChevronDown,
  Eraser,
  Expand,
  ImagePlus,
  Loader2,
  ScanFace,
  Sparkles,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { features, imageUrl } from "@/components/pixelmorph/features";

type ToolSlug = "background-removal" | "generative-fill" | "object-removal" | "generative-replace" | "image-restoration";
type AspectRatio = "1:1" | "16:9" | "9:16";
type Tool = {
  slug: ToolSlug;
  label: string;
  description: string;
  icon: typeof Sparkles;
};

const tools: Tool[] = [
  { slug: "background-removal", label: "Background removal", description: "Isolate your subject", icon: ScanFace },
  { slug: "generative-fill", label: "Generative fill", description: "Expand your canvas", icon: Expand },
  { slug: "object-removal", label: "Object removal", description: "Erase distractions", icon: Eraser },
  { slug: "generative-replace", label: "Generative replace", description: "Replace with a prompt", icon: Wand2 },
  { slug: "image-restoration", label: "Smart upscale", description: "Restore image detail", icon: ImagePlus },
];

const starterImage = imageUrl("photo-1542291026-7eec264c27ff", 1600);

type StudioPageProps = {
  searchParams?: { tool?: string | string[] };
};

const isToolSlug = (value: string | undefined): value is ToolSlug =>
  tools.some((tool) => tool.slug === value);

export default function StudioPage({ searchParams }: StudioPageProps) {
  const requestedTool = Array.isArray(searchParams?.tool) ? searchParams.tool[0] : searchParams?.tool;
  const [activeTool, setActiveTool] = useState<ToolSlug>(isToolSlug(requestedTool) ? requestedTool : "background-removal");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [prompt, setPrompt] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState("red-sneaker-product.jpg");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [background, setBackground] = useState("#f3f0ff");
  const [transparentBackground, setTransparentBackground] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [uploadedUrl]);

  const selectedTool = tools.find((tool) => tool.slug === activeTool) ?? tools[0];
  const previewImage = uploadedUrl ?? starterImage;
  const toolConfig = features.find((feature) => feature.slug === activeTool);
  const isPromptTool = activeTool === "generative-fill" || activeTool === "object-removal" || activeTool === "generative-replace";

  const setFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    setUploadedUrl(URL.createObjectURL(file));
    setFilename(file.name);
    setShowResult(false);
    setStatus("idle");
  };

  const onFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    setFile(event.dataTransfer.files?.[0]);
  };

  const runPreview = () => {
    if (isPromptTool && !prompt.trim()) return;
    setStatus("generating");
    setShowResult(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus("done");
      setShowResult(true);
      timerRef.current = null;
    }, 1500);
  };

  const reset = () => {
    setStatus("idle");
    setShowResult(false);
    setPrompt("");
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#09090c]">
      <div className="flex min-h-[calc(100vh-72px)] flex-col">
        <div className="flex min-h-[68px] items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Untitled project</p>
            <p className="mt-0.5 truncate text-xs text-zinc-500">{filename} <span className="px-1">·</span> Demo workspace</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button onClick={reset} variant="outline" className="h-9 border-white/10 bg-transparent text-xs text-zinc-300 hover:bg-white/[0.06] hover:text-white">Reset</Button>
            <Button onClick={() => { if (!showResult) runPreview(); else window.alert("This is a UI demo. Connect Cloudinary transformations to export an edited image."); }} className="h-9 rounded-lg bg-violet-500 px-3 text-xs font-semibold text-white hover:bg-violet-400 sm:px-4">
              {showResult ? <><ArrowDownToLine size={14} className="mr-1.5" /> Export</> : <><Sparkles size={14} className="mr-1.5" /> Apply edit</>}
            </Button>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
          <aside className="border-b border-white/[0.08] bg-[#0d0c11] p-4 lg:border-b-0 lg:border-r">
            <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">AI tools</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {tools.map(({ slug, label, description, icon: Icon }) => (
                <button key={slug} type="button" onClick={() => { setActiveTool(slug); setStatus("idle"); setShowResult(false); }} className={`group flex items-center gap-3 rounded-xl border p-2.5 text-left transition lg:p-3 ${activeTool === slug ? "border-violet-400/30 bg-violet-400/[0.09]" : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.035]"}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activeTool === slug ? "bg-violet-400/15 text-violet-200" : "bg-white/[0.05] text-zinc-400 group-hover:text-zinc-200"}`}><Icon size={17} /></span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-zinc-100">{label}</span>
                    <span className="mt-1 hidden truncate text-[10px] text-zinc-500 lg:block">{description}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-5 hidden rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 lg:block">
              <p className="text-xs font-medium text-zinc-300">Powered by Cloudinary</p>
              <p className="mt-1.5 text-[11px] leading-5 text-zinc-500">AI-powered transformations, ready for your creative workflow.</p>
            </div>
          </aside>

          <section className="flex min-h-[55vh] flex-col bg-[#111015] p-3 sm:p-5 lg:min-h-0 lg:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-100">{selectedTool.label}</p>
                <p className="mt-1 truncate text-xs text-zinc-500">{selectedTool.description}</p>
              </div>
              <Button onClick={() => inputRef.current?.click()} variant="outline" className="h-9 shrink-0 border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white">
                <Upload size={14} className="mr-2" /> Upload image
              </Button>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileInput} />
            </div>
            <div
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_50%_45%,#282431_0%,#19171e_55%,#141218_100%)] p-5 transition ${dragging ? "border-violet-300 bg-violet-400/10" : "border-white/[0.08]"}`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
              <div className="relative w-full max-w-[720px]">
                <div className="relative mx-auto aspect-[1.5/1] max-h-[62vh] overflow-hidden rounded-xl shadow-2xl shadow-black/40" style={{
                  aspectRatio: showResult && activeTool === "generative-fill" ? aspectRatio.replace(":", " / ") : "1.5 / 1",
                  backgroundColor: showResult && activeTool === "background-removal" && !transparentBackground ? background : undefined,
                }}>
                  {transparentBackground && showResult && activeTool === "background-removal" && <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(45deg,#aaa 25%,transparent 25%),linear-gradient(-45deg,#aaa 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#aaa 75%),linear-gradient(-45deg,transparent 75%,#aaa 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0" }} />}
                  <Image
                    src={previewImage}
                    alt={filename}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className={`object-cover transition duration-700 ${showResult && activeTool === "image-restoration" ? "saturate-125 contrast-110" : ""} ${showResult && activeTool === "generative-fill" ? "scale-110" : ""} ${showResult && activeTool === "background-removal" && transparentBackground ? "mix-blend-multiply" : ""}`}
                    style={{ clipPath: showResult && activeTool === "object-removal" ? "inset(0 0 0 0)" : undefined }}
                  />
                  {showResult && activeTool === "generative-replace" && <div className="absolute bottom-3 left-3 rounded-lg border border-white/15 bg-black/55 px-3 py-2 text-xs text-white backdrop-blur">Prompt preview: {prompt}</div>}
                  {showResult && (
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-black/50 px-3 py-1.5 text-[11px] text-emerald-200 backdrop-blur"><Check size={13} /> Demo preview</div>
                  )}
                  {status === "generating" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 backdrop-blur-sm">
                      <Loader2 size={29} className="animate-spin text-violet-300" />
                      <p className="text-sm font-medium text-white">Creating your preview…</p>
                      <p className="text-xs text-zinc-300">Simulated AI transformation</p>
                    </div>
                  )}
                </div>
                {showResult && <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500"><Sparkles size={12} className="text-violet-300" /> This is a mock preview; connect Cloudinary to generate production edits.</div>}
                {dragging && <div className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed border-violet-300 bg-violet-950/60 text-sm font-medium text-violet-100"><Upload size={18} className="mr-2" /> Drop image to upload</div>}
              </div>
              {!uploadedUrl && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-zinc-400 backdrop-blur">
                  <span className="hidden sm:inline">Drop an image anywhere or</span>
                  <button type="button" onClick={() => inputRef.current?.click()} className="font-medium text-violet-200 hover:text-white">browse files</button>
                  <span className="text-zinc-600">· JPG, PNG, WEBP</span>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
              <span className="truncate">{filename}</span>
              <span className="shrink-0 pl-3">{showResult ? "Preview · 1200 × 800" : "Canvas preview"}</span>
            </div>
          </section>

          <aside className="border-t border-white/[0.08] bg-[#0d0c11] p-5 lg:border-l lg:border-t-0 lg:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Adjustments</h2>
              <button type="button" onClick={reset} aria-label="Reset adjustments" className="text-xs text-zinc-500 transition hover:text-white">Reset</button>
            </div>
            <p className="mt-1.5 text-xs leading-5 text-zinc-500">{toolConfig?.detail}</p>

            {activeTool === "background-removal" && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-medium text-zinc-300">Background</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setTransparentBackground(true)} className={`flex-1 rounded-lg border px-3 py-2.5 text-xs ${transparentBackground ? "border-violet-400/40 bg-violet-400/10 text-violet-100" : "border-white/10 text-zinc-400 hover:text-white"}`}>Transparent</button>
                  <button type="button" onClick={() => setTransparentBackground(false)} className={`flex-1 rounded-lg border px-3 py-2.5 text-xs ${!transparentBackground ? "border-violet-400/40 bg-violet-400/10 text-violet-100" : "border-white/10 text-zinc-400 hover:text-white"}`}>Solid color</button>
                </div>
                {!transparentBackground && <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 p-3"><input aria-label="Choose background color" type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-8 w-9 cursor-pointer rounded border-0 bg-transparent" /><span className="text-xs text-zinc-300">{background.toUpperCase()}</span></div>}
                <p className="mt-4 text-[11px] leading-5 text-zinc-500">Choose how your isolated subject appears in the demo preview.</p>
              </div>
            )}

            {activeTool === "generative-fill" && (
              <div className="mt-7">
                <label className="mb-3 block text-xs font-medium text-zinc-300">Output aspect ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["1:1", "16:9", "9:16"] as AspectRatio[]).map((ratio) => <button key={ratio} type="button" onClick={() => setAspectRatio(ratio)} className={`rounded-lg border py-2.5 text-xs ${aspectRatio === ratio ? "border-violet-400/40 bg-violet-400/10 text-violet-100" : "border-white/10 text-zinc-400 hover:text-white"}`}>{ratio}</button>)}
                </div>
                <label htmlFor="fill-prompt" className="mb-2 mt-5 block text-xs font-medium text-zinc-300">Describe the expanded area <span className="text-zinc-600">(optional)</span></label>
                <textarea id="fill-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="e.g. Continue the meadow and soft clouds" className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/50" />
              </div>
            )}

            {activeTool === "object-removal" && (
              <div className="mt-7">
                <p className="mb-2 text-xs font-medium text-zinc-300">What should be removed?</p>
                <Input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="e.g. the person in the background" className="h-10 border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600" />
                <p className="mt-2 text-[11px] leading-5 text-zinc-500">Describe the object to remove. Brush selection is coming soon.</p>
              </div>
            )}

            {activeTool === "generative-replace" && (
              <div className="mt-7">
                <label htmlFor="replace-prompt" className="mb-2 block text-xs font-medium text-zinc-300">Describe the replacement</label>
                <textarea id="replace-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="e.g. a vintage red bicycle" className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/50" />
                <p className="mt-2 text-[11px] leading-5 text-zinc-500">In the full editor, brush over the object you want to replace.</p>
              </div>
            )}

            {activeTool === "image-restoration" && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-medium text-zinc-300">Enhancement</p>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.025] p-3 text-xs text-zinc-300"><span>Smart upscale</span><span className="rounded-md bg-violet-400/10 px-2 py-1 text-[10px] text-violet-200">2×</span></div>
                <p className="mt-2 text-[11px] leading-5 text-zinc-500">Improve clarity and restore details in a demo preview.</p>
              </div>
            )}

            <div className="mt-7 border-t border-white/[0.08] pt-5">
              <Button onClick={runPreview} disabled={status === "generating" || (isPromptTool && !prompt.trim())} className="h-11 w-full rounded-xl bg-violet-500 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-40">
                {status === "generating" ? <>                <Loader2 size={15} className="mr-2 animate-spin" /> Generating…</> : <><Sparkles size={15} className="mr-2" /> Generate preview</>}
              </Button>
              <p className="mt-3 text-center text-[10px] leading-4 text-zinc-600">Demo mode · No image is sent to a server</p>
            </div>

            <details className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
              <summary className="flex cursor-pointer list-none items-center justify-between p-3 text-xs font-medium text-zinc-300">
                Transformation details <ChevronDown size={14} className="text-zinc-500" />
              </summary>
              <div className="border-t border-white/[0.07] px-3 py-3">
                <code className="break-all text-[10px] text-violet-200">{toolConfig?.transformation ?? "e_background_removal"}</code>
                {activeTool === "generative-fill" && <p className="mt-2 text-[10px] text-zinc-500">Aspect ratio: {aspectRatio}</p>}
              </div>
            </details>
            <div className="mt-4 flex items-start gap-2 text-[10px] leading-4 text-zinc-600"><X size={13} className="mt-0.5 shrink-0" />Previews are illustrative. Connect Cloudinary AI APIs to process and export real transformations.</div>
          </aside>
        </div>
      </div>
    </main>
  );
}
