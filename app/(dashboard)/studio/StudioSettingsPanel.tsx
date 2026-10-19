"use client";

import { ChevronDown, Loader2, Sparkles, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { useStudio } from "@/hooks/useStudio";
import type { AspectRatio } from "@/types/studio";

type Props = Pick<ReturnType<typeof useStudio>, "state" | "actions">;

export function StudioSettingsPanel({ state, actions }: Props) {
  const {
    activeTool,
    aspectRatio,
    prompt,
    replaceFrom,
    tagConfidence,
    detectedTags,
    autoTagComplete,
    uploadedPublicId,
    status,
    background,
    baselineBackgroundId,
    recolorTarget,
    recolorColor,
    cameraUp,
    cameraRight,
    cameraFrames,
    zoomPanMaxZoom,
    zoomPanDuration,
    transparentBackground,
    effectAmount,
    transformationPreview,
    appliedEdits,
    selectedTool,
  } = state;
  const {
    reset,
    runAutoTagging,
    setTagConfidence,
    invalidateResult,
    setTransparentBackground,
    setBackground,
    setBaselineBackgroundId,
    setRecolorTarget,
    setRecolorColor,
    setAspectRatio,
    setPrompt,
    setReplaceFrom,
    setEffectAmount,
    setCameraUp,
    setCameraRight,
    setCameraFrames,
    setZoomPanMaxZoom,
    setZoomPanDuration,
    runTransformation,
  } = actions;
  const isPromptTool = [
    "object-removal",
    "extract",
    "generative-background-replace",
  ].includes(activeTool);

  return (
    <aside className="border-t border-white/[0.08] bg-[#0d0c11] p-5 lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:p-5">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <h2 className="text-sm font-semibold text-white">
          {activeTool === "auto-tagging" ? "Image auto-tagging" : "Adjustments"}
        </h2>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset adjustments"
          disabled={status === "saving"}
          className="rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
        >
          Reset
        </button>
      </div>
      <p className="mt-1.5 text-xs leading-5 text-zinc-500">
        {selectedTool.description}
      </p>

      {activeTool === "auto-tagging" && (
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs font-medium text-zinc-300">Current image</p>
            <p className="mt-2 truncate rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-zinc-400">
              {uploadedPublicId || "Upload an image to enable auto-tagging"}
            </p>
            <p className="mt-2 text-[10px] leading-4 text-zinc-500">
              Tags are applied directly to the image already open in Studio.
            </p>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="tag-confidence"
                className="text-xs font-medium text-zinc-300"
              >
                Minimum tag confidence
              </label>
              <span className="text-xs tabular-nums text-violet-200">
                {tagConfidence.toFixed(2)}
              </span>
            </div>
            <input
              id="tag-confidence"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={tagConfidence}
              onChange={(event) => setTagConfidence(Number(event.target.value))}
              className="w-full accent-violet-400"
            />
            <p className="mt-1 text-[10px] text-zinc-600">
              Google tagging adds labels at or above this score.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => void runAutoTagging()}
            disabled={status !== "idle" || !uploadedPublicId}
            className="h-11 w-full rounded-xl bg-violet-500 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400 disabled:opacity-40"
          >
            {status === "tagging" ? (
              <>
                <Loader2 size={15} className="mr-2 animate-spin" /> Tagging
                image…
              </>
            ) : (
              <>
                <Tag size={15} className="mr-2" /> Auto-tag current image
              </>
            )}
          </Button>
          {detectedTags.length > 0 && (
            <section
              aria-live="polite"
              className="rounded-xl border border-emerald-300/15 bg-emerald-300/[0.04] p-3"
            >
              <h3 className="flex items-center gap-2 text-xs font-medium text-emerald-200">
                <Tag size={14} /> Detected tags
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {detectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
          {autoTagComplete &&
            detectedTags.length === 0 &&
            status === "idle" && (
              <p className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[11px] leading-5 text-zinc-500">
                No Google tags met the selected confidence threshold.
              </p>
            )}
        </div>
      )}

      {activeTool === "background-removal" && (
        <div className="mt-7">
          <p className="mb-3 text-xs font-medium text-zinc-300">Background</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                invalidateResult();
                setTransparentBackground(true);
              }}
              className={`flex-1 rounded-lg border px-3 py-2.5 text-xs ${transparentBackground ? "border-violet-400/40 bg-violet-400/10 text-violet-100" : "border-white/10 text-zinc-400 hover:text-white"}`}
            >
              Transparent
            </button>
            <button
              type="button"
              onClick={() => {
                invalidateResult();
                setTransparentBackground(false);
              }}
              className={`flex-1 rounded-lg border px-3 py-2.5 text-xs ${!transparentBackground ? "border-violet-400/40 bg-violet-400/10 text-violet-100" : "border-white/10 text-zinc-400 hover:text-white"}`}
            >
              Solid color
            </button>
          </div>
          {!transparentBackground && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 p-3">
              <input
                aria-label="Choose background color"
                type="color"
                value={background}
                onChange={(event) => {
                  invalidateResult();
                  setBackground(event.target.value);
                }}
                className="h-8 w-9 cursor-pointer rounded border-0 bg-transparent"
              />
              <span className="text-xs text-zinc-300">
                {background.toUpperCase()}
              </span>
            </div>
          )}
          <p className="mt-4 text-[11px] leading-5 text-zinc-500">
            Remove the background, then keep it transparent or pad the image
            with your selected solid color.
          </p>
        </div>
      )}

      {activeTool === "face-privacy" && (
        <p className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-xs leading-5 text-zinc-400">
          Cloudinary detects and blurs faces to help protect people&apos;s
          privacy.
        </p>
      )}

      {activeTool === "enhance" && (
        <p className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-xs leading-5 text-zinc-400">
          Automatically improve the image&apos;s colors, contrast, and
          brightness.
        </p>
      )}

      {(activeTool === "auto-enhance" ||
        activeTool === "improve-indoor") && (
        <p className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-xs leading-5 text-zinc-400">
          {activeTool === "auto-enhance"
            ? "Automatically balance the image for a natural enhancement."
            : "Improve color, contrast, and brightness for indoor photography."}
        </p>
      )}

      {activeTool === "baseline" && (
        <div className="mt-7">
          <label
            htmlFor="baseline-background"
            className="mb-2 block text-xs font-medium text-zinc-300"
          >
            Background image public ID{" "}
            <span className="text-zinc-600">(optional)</span>
          </label>
          <Input
            id="baseline-background"
            value={baselineBackgroundId}
            onChange={(event) => setBaselineBackgroundId(event.target.value)}
            placeholder="e.g. docs/sky"
            className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600 focus-visible:border-violet-400/40 focus-visible:ring-violet-400/30 focus-visible:ring-offset-0"
          />
          <p className="mt-2 text-[11px] leading-5 text-zinc-500">
            Removes the background and converts the subject to grayscale. Add
            a Cloudinary public ID to place an image behind it.
          </p>
        </div>
      )}

      {activeTool === "generative-fill" && (
        <div className="mt-7">
          <label className="mb-3 block text-xs font-medium text-zinc-300">
            Output aspect ratio
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["1:1", "16:9", "9:16"] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => {
                  invalidateResult();
                  setAspectRatio(ratio);
                }}
                className={`rounded-lg border py-2.5 text-xs ${aspectRatio === ratio ? "border-violet-400/40 bg-violet-400/10 text-violet-100" : "border-white/10 text-zinc-400 hover:text-white"}`}
              >
                {ratio}
              </button>
            ))}
          </div>
          <label
            htmlFor="fill-prompt"
            className="mb-2 mt-5 block text-xs font-medium text-zinc-300"
          >
            Describe the expanded area{" "}
            <span className="text-zinc-600">(optional)</span>
          </label>
          <textarea
            id="fill-prompt"
            value={prompt}
            onChange={(event) => {
              invalidateResult();
              setPrompt(event.target.value);
            }}
            placeholder="e.g. Continue the meadow and soft clouds"
            className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/50"
          />
        </div>
      )}

      {activeTool === "object-removal" && (
        <div className="mt-7">
          <p className="mb-2 text-xs font-medium text-zinc-300">
            What should be removed?
          </p>
          <Input
            value={prompt}
            onChange={(event) => {
              invalidateResult();
              setPrompt(event.target.value);
            }}
            placeholder="e.g. the person in the background"
            className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600 focus-visible:border-violet-400/40 focus-visible:ring-violet-400/30 focus-visible:ring-offset-0"
          />
          <p className="mt-2 text-[11px] leading-5 text-zinc-500">
            Describe the object to remove. Brush selection is coming soon.
          </p>
        </div>
      )}

      {activeTool === "generative-replace" && (
        <div className="mt-7">
          <label
            htmlFor="replace-from"
            className="mb-2 block text-xs font-medium text-zinc-300"
          >
            Object to replace
          </label>
          <Input
            id="replace-from"
            value={replaceFrom}
            onChange={(event) => {
              invalidateResult();
              setReplaceFrom(event.target.value);
            }}
            placeholder="e.g. a red car"
            className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600 focus-visible:border-violet-400/40 focus-visible:ring-violet-400/30 focus-visible:ring-offset-0"
          />
          <label
            htmlFor="replace-prompt"
            className="mb-2 mt-4 block text-xs font-medium text-zinc-300"
          >
            Replace it with
          </label>
          <textarea
            id="replace-prompt"
            value={prompt}
            onChange={(event) => {
              invalidateResult();
              setPrompt(event.target.value);
            }}
            placeholder="e.g. a vintage red bicycle"
            className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/50"
          />
          <p className="mt-2 text-[11px] leading-5 text-zinc-500">
            Cloudinary will replace the described object in this image.
          </p>
        </div>
      )}

      {(activeTool === "extract" ||
        activeTool === "generative-background-replace") && (
        <div className="mt-7">
          <label
            htmlFor="ai-prompt"
            className="mb-2 block text-xs font-medium text-zinc-300"
          >
            {activeTool === "extract"
              ? "Describe what to extract"
              : "Describe the replacement background"}
          </label>
          <Input
            id="ai-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={
              activeTool === "extract"
                ? "e.g. the woman on the left"
                : "e.g. an empty beach"
            }
            className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600 focus-visible:border-violet-400/40 focus-visible:ring-violet-400/30 focus-visible:ring-offset-0"
          />
        </div>
      )}

      {activeTool === "generative-recolor" && (
        <div className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="recolor-target"
              className="mb-2 block text-xs font-medium text-zinc-300"
            >
              Object to recolor
            </label>
            <Input
              id="recolor-target"
              value={recolorTarget}
              onChange={(event) => setRecolorTarget(event.target.value)}
              placeholder="e.g. sweater"
              className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600 focus-visible:border-violet-400/40 focus-visible:ring-violet-400/30 focus-visible:ring-offset-0"
            />
          </div>
          <div>
            <label
              htmlFor="recolor-color"
              className="mb-2 block text-xs font-medium text-zinc-300"
            >
              New color
            </label>
            <Input
              id="recolor-color"
              value={recolorColor}
              onChange={(event) => setRecolorColor(event.target.value)}
              placeholder="e.g. green or 5632a8"
              className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600 focus-visible:border-violet-400/40 focus-visible:ring-violet-400/30 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      )}

      {activeTool === "camera-360" && (
        <div className="mt-7 space-y-4">
          <p className="text-xs leading-5 text-zinc-500">
            For Cloudinary 3D assets. Output is an animated WebP.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Up angle", cameraUp, setCameraUp, -90, 90],
              ["Right angle", cameraRight, setCameraRight, -180, 180],
              ["Frames", cameraFrames, setCameraFrames, 1, 120],
            ].map(([label, value, setter, min, max]) => (
              <label
                key={label as string}
                className="text-[10px] font-medium text-zinc-400"
              >
                {label as string}
                <Input
                  type="number"
                  min={min as number}
                  max={max as number}
                  value={value as number}
                  onChange={(event) =>
                    (setter as (value: number) => void)(
                      Number(event.target.value),
                    )
                  }
                  className="mt-1 h-9 rounded-lg border-white/10 bg-white/[0.03] px-2 text-xs text-white focus-visible:border-violet-400/40 focus-visible:ring-violet-400/30 focus-visible:ring-offset-0"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {activeTool === "zoom-pan" && (
        <div className="mt-7 space-y-4">
          <p className="text-xs leading-5 text-zinc-500">
            Creates a looping animated GIF. Works best with animated or video
            source assets.
          </p>
          <div>
            <label
              htmlFor="zoom-pan-max"
              className="mb-2 block text-xs font-medium text-zinc-300"
            >
              Maximum zoom ({zoomPanMaxZoom}×)
            </label>
            <input
              id="zoom-pan-max"
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={zoomPanMaxZoom}
              onChange={(event) => setZoomPanMaxZoom(Number(event.target.value))}
              className="w-full accent-violet-400"
            />
          </div>
          <div>
            <label
              htmlFor="zoom-pan-duration"
              className="mb-2 block text-xs font-medium text-zinc-300"
            >
              Duration ({zoomPanDuration} seconds)
            </label>
            <input
              id="zoom-pan-duration"
              type="range"
              min="1"
              max="30"
              value={zoomPanDuration}
              onChange={(event) => setZoomPanDuration(Number(event.target.value))}
              className="w-full accent-violet-400"
            />
          </div>
        </div>
      )}

      {[
        "basic-blur",
        "basic-brightness",
        "basic-contrast",
        "basic-saturation",
        "basic-sharpen",
        "basic-pixelate",
        "basic-opacity",
      ].includes(activeTool) && (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="effect-amount"
              className="text-xs font-medium text-zinc-300"
            >
              {activeTool === "basic-blur"
                ? "Blur strength"
                : activeTool === "basic-pixelate"
                  ? "Pixel size"
                  : activeTool === "basic-opacity"
                    ? "Opacity"
                    : activeTool === "basic-brightness"
                      ? "Brightness"
                      : activeTool === "basic-contrast"
                        ? "Contrast"
                        : activeTool === "basic-saturation"
                          ? "Saturation"
                          : "Sharpen"}
            </label>
            <span className="text-xs tabular-nums text-zinc-500">
              {[
                "basic-brightness",
                "basic-contrast",
                "basic-saturation",
              ].includes(activeTool)
                ? `${effectAmount - 50}`
                : `${effectAmount}%`}
            </span>
          </div>
          <input
            id="effect-amount"
            type="range"
            min="1"
            max="100"
            value={effectAmount}
            onChange={(event) => {
              invalidateResult();
              setEffectAmount(Number(event.target.value));
            }}
            className="w-full accent-violet-400"
          />
          {[
            "basic-brightness",
            "basic-contrast",
            "basic-saturation",
          ].includes(activeTool) && (
            <p className="mt-1 text-[10px] text-zinc-600">
              Center is neutral; move left to reduce or right to increase.
            </p>
          )}
        </div>
      )}

      {activeTool === "image-restoration" && (
        <div className="mt-7">
          <p className="mb-3 text-xs font-medium text-zinc-300">Enhancement</p>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.025] p-3 text-xs text-zinc-300">
            <span>Smart upscale</span>
            <span className="rounded-md bg-violet-400/10 px-2 py-1 text-[10px] text-violet-200">
              2×
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-zinc-500">
            Cloudinary applies its image restoration transformation.
          </p>
        </div>
      )}

      {activeTool === "smart-crop" && (
        <p className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-xs leading-5 text-zinc-400">
          Automatically crop your image to a 1:2 phone portrait.
        </p>
      )}

      {activeTool === "basic-auto-fill-pad" && (
        <p className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-xs leading-5 text-zinc-400">
          Automatically generate background pixels to pad the image to the
          editor canvas.
        </p>
      )}

      <div className="mt-7 border-t border-white/[0.08] pt-5">
        <Button
          onClick={runTransformation}
          disabled={
            activeTool === "auto-tagging" ||
            !uploadedPublicId ||
            status === "uploading" ||
            status === "applying" ||
            status === "downloading" ||
            status === "saving" ||
            (isPromptTool && !prompt.trim()) ||
            (activeTool === "generative-recolor" &&
              (!recolorTarget.trim() || !recolorColor.trim())) ||
            (activeTool === "generative-replace" &&
              (!replaceFrom.trim() || !prompt.trim()))
          }
          className="h-11 w-full rounded-xl bg-violet-500 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400 disabled:opacity-40"
        >
          {status === "applying" ? (
            <>
              <Loader2 size={15} className="mr-2 animate-spin" />
              Applying…
            </>
          ) : (
            <>
              <Sparkles size={15} className="mr-2" /> Apply transformation
            </>
          )}
        </Button>
        <p className="mt-3 text-center text-[10px] leading-4 text-zinc-600">
          Powered by Cloudinary image transformations
        </p>
      </div>

      <details className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
        <summary className="flex cursor-pointer list-none items-center justify-between p-3 text-xs font-medium text-zinc-300">
          Transformation details{" "}
          <ChevronDown size={14} className="text-zinc-500" />
        </summary>
        <div className="border-t border-white/[0.07] px-3 py-3">
          <code className="break-all text-[10px] text-violet-200">
            {transformationPreview}
          </code>
          {activeTool === "generative-fill" && (
            <p className="mt-2 text-[10px] text-zinc-500">
              Aspect ratio: {aspectRatio}
            </p>
          )}
          {appliedEdits.length > 0 && (
            <ol className="mt-4 space-y-2 border-t border-white/[0.07] pt-3">
              {appliedEdits.map((edit, index) => (
                <li
                  key={edit.id}
                  className="flex items-start gap-2 text-[10px] leading-4 text-zinc-500"
                >
                  <span className="shrink-0 text-violet-300">{index + 1}.</span>
                  <span className="min-w-0">
                    <span className="block font-medium text-zinc-300">
                      {edit.label}
                    </span>
                    <code className="break-all text-violet-200/80">
                      {edit.transformation}
                    </code>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </details>
      <div className="mt-4 flex items-start gap-2 text-[10px] leading-4 text-zinc-600">
        <X size={13} className="mt-0.5 shrink-0" />
        Generative AI effects require the corresponding Cloudinary features to
        be enabled for your account.
      </div>
    </aside>
  );
}
