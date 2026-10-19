"use client";

import { useState } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import {
  ArrowUpRight,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ImagePreviewPanelProps } from "@/types/components";
import DeleteImageDialog from "./DeleteImageDialog";

export default function ImagePreviewPanel({
  image,
  open,
  onOpenChange,
  onDeleted,
}: ImagePreviewPanelProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [effect, setEffect] = useState<"none" | "grayscale" | "sepia">("none");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const imageName = image.public_id.split("/").pop() ?? image.public_id;

  const closePanel = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setRotation(0);
      setZoom(1);
      setEffect("none");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={closePanel}>
        <DialogContent className="flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-[24px] border-white/[0.09] bg-[#111115] p-0 text-zinc-100 shadow-2xl shadow-black/60 sm:h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)]">
          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 border-b border-white/[0.08] bg-[#111115] px-4 py-3 pr-12 sm:px-6 sm:py-4 sm:pr-14">
            <DialogHeader className="min-w-0 flex-1 space-y-1 text-left">
              <DialogTitle className="truncate text-sm font-semibold text-white sm:text-base">
                {imageName}
              </DialogTitle>
              <DialogDescription className="truncate text-[10px] text-zinc-500 sm:text-xs">
                {image.public_id}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
                <button
                  type="button"
                  aria-label="Rotate left"
                  title="Rotate left"
                  onClick={() => setRotation((value) => (value - 90 + 360) % 360)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Rotate right"
                  title="Rotate right"
                  onClick={() => setRotation((value) => (value + 90) % 360)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <RotateCw size={15} />
                </button>
                <span className="mx-1 h-5 w-px bg-white/10" />
                <button
                  type="button"
                  aria-label="Zoom out"
                  title="Zoom out"
                  disabled={zoom <= 1}
                  onClick={() =>
                    setZoom((value) =>
                      Math.max(1, Number((value - 0.25).toFixed(2))),
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center text-[10px] tabular-nums text-zinc-300">
                  {zoom.toFixed(2)}×
                </span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  title="Zoom in"
                  disabled={zoom >= 2}
                  onClick={() =>
                    setZoom((value) =>
                      Math.min(2, Number((value + 0.25).toFixed(2))),
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                >
                  <Plus size={15} />
                </button>
              </div>

              <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
                {([
                  { id: "grayscale", label: "B&W" },
                  { id: "sepia", label: "Sepia" },
                ] as const).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={effect === id}
                    onClick={() =>
                      setEffect((current) => (current === id ? "none" : id))
                    }
                    className={`h-8 rounded-md px-2.5 text-[10px] transition ${effect === id ? "bg-brand/10 text-brand-100" : "text-zinc-400 hover:text-white"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setRotation(0);
                  setZoom(1);
                  setEffect("none");
                }}
                className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-[10px] text-zinc-500 transition hover:bg-white/[0.05] hover:text-brand-200"
              >
                <RotateCcw size={13} /> Reset
              </button>

              <Button
                asChild
                className="h-9 rounded-lg bg-brand px-3 text-[11px] font-semibold text-[#24100d] hover:bg-brand-200"
              >
                <Link href={`/studio?publicId=${encodeURIComponent(image.public_id)}`}>
                  <Sparkles size={13} className="mr-1.5" />
                  <span className="hidden sm:inline">Edit</span>
                  <ArrowUpRight size={13} className="sm:ml-1" />
                </Link>
              </Button>
              <button
                type="button"
                aria-label="Delete image"
                title="Delete image"
                onClick={() => setDeleteOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-400/15 bg-rose-400/[0.04] text-rose-200 transition hover:bg-rose-400/[0.12]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center bg-[#09090c] p-2 sm:p-5 lg:p-7">
            <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_45%,#292421_0%,#191716_55%,#141211_100%)]">
                <CldImage
                  key={`${image.public_id}-${rotation}-${zoom}-${effect}`}
                  src={image.public_id}
                  alt={imageName}
                  width={1800}
                  height={1400}
                  crop="limit"
                  format="auto"
                  quality={85}
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                  }}
                  className={`h-full max-h-full w-full max-w-full object-contain transition-transform duration-300 ${effect === "grayscale" ? "grayscale" : ""} ${effect === "sepia" ? "sepia" : ""}`}
                />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[10px] text-white/70 backdrop-blur sm:bottom-4 sm:left-4">
                  Preview adjustments only
                </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteImageDialog
        image={image}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => {
          setDeleteOpen(false);
          closePanel(false);
          onDeleted();
        }}
      />
    </>
  );
}
