"use client";

import {
  ArrowDownToLine,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { useStudio } from "./useStudio";
import { tools } from "./studio-model";
import { StudioSettingsPanel } from "./StudioSettingsPanel";

type StudioPageProps = {
  searchParams?: {
    tool?: string | string[];
    publicId?: string | string[];
  };
};

export default function StudioPage({ searchParams }: StudioPageProps) {
  const requestedTool = Array.isArray(searchParams?.tool)
    ? searchParams.tool[0]
    : searchParams?.tool;
  const requestedPublicId = Array.isArray(searchParams?.publicId)
    ? searchParams.publicId[0]
    : searchParams?.publicId;
  const { state, actions } = useStudio({ requestedTool, requestedPublicId });
  const {
    activeTool,
    uploadedPublicId,
    filename,
    mainImageRevision,
    appliedEdits,
    dragging,
    status,
    errorMessage,
    saveMessage,
    transformedUrl,
    selectedTool,
    transformationProps,
    inputRef,
  } = state;
  const {
    setActiveTool,
    setDragging,
    onFileInput,
    onDrop,
    reset,
    downloadResult,
    saveResultToCloudinary,
  } = actions;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#09090c] lg:h-[calc(100vh-72px)] lg:overflow-hidden">
      <div className="flex min-h-[calc(100vh-72px)] flex-col lg:h-full lg:min-h-0">
        <div className="flex min-h-[68px] items-center justify-between gap-3 border-b border-white/[0.08] bg-[#09090c] px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Untitled project</p>
            <p className="mt-0.5 truncate text-xs text-zinc-500">
              {filename || "Drop an image to get started"}
              {uploadedPublicId && (
                <>
                  <span className="px-1">·</span> Cloudinary asset
                </>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              onClick={reset}
              disabled={appliedEdits.length === 0 || status === "saving"}
              variant="outline"
              className="h-9 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white"
            >
              Reset all
            </Button>
            {appliedEdits.length > 0 && (
              <>
                <Button
                  onClick={() => void downloadResult()}
                  disabled={
                    !transformedUrl ||
                    status === "applying" ||
                    status === "downloading" ||
                    status === "saving"
                  }
                  variant="outline"
                  className="h-9 rounded-xl border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-40"
                >
                  {status === "downloading" ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <ArrowDownToLine size={14} className="mr-1.5" />
                  )}
                  Download
                </Button>
                <Button
                  onClick={() => void saveResultToCloudinary()}
                  disabled={
                    !transformedUrl ||
                    status === "applying" ||
                    status === "downloading" ||
                    status === "saving"
                  }
                  className="h-9 rounded-xl bg-violet-500 px-3 text-xs font-semibold text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400 disabled:opacity-40"
                >
                  {status === "saving" ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <Upload size={14} className="mr-1.5" />
                  )}
                  {status === "saving" ? "Saving…" : "Save to Cloudinary"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 lg:min-h-0 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
          <aside className="border-b border-white/[0.08] bg-[#0d0c11] p-4 lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
            <div className="space-y-5">
              {(["AI tools", "Basic"] as const).map((category) => (
                <section key={category}>
                  <h2 className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    {category}
                  </h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                    {tools
                      .filter((tool) => tool.category === category)
                      .map(({ slug, label, description, icon: Icon }) => (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => setActiveTool(slug)}
                          className={`group flex items-center gap-3 rounded-xl p-2.5 text-left transition lg:p-3 ${activeTool === slug ? "bg-violet-400/[0.12] text-violet-100 ring-1 ring-inset ring-violet-300/15" : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"}`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activeTool === slug ? "bg-violet-400/10 text-violet-300" : "bg-white/[0.05] text-zinc-500 group-hover:text-zinc-300"}`}
                          >
                            <Icon size={17} />
                          </span>
                          <span className="min-w-0">
                            <span
                              className={`block truncate text-xs font-medium ${activeTool === slug ? "text-violet-100" : "text-zinc-100"}`}
                            >
                              {label}
                            </span>
                            <span className="mt-1 hidden truncate text-[10px] text-zinc-500 lg:block">
                              {description}
                            </span>
                          </span>
                        </button>
                      ))}
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-5 hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] to-fuchsia-500/[0.04] p-4 lg:block">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10 text-violet-200">
                <Sparkles size={16} />
              </span>
              <p className="text-xs font-medium text-zinc-300">
                Powered by Cloudinary
              </p>
              <p className="mt-1.5 text-[11px] leading-5 text-zinc-500">
                AI-powered transformations, ready for your creative workflow.
              </p>
            </div>
          </aside>

          <section className="flex min-h-[55vh] flex-col bg-[#0d0c12] p-3 sm:p-5 lg:min-h-0 lg:overflow-hidden lg:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-100">
                  {selectedTool.label}
                </p>
                <p className="mt-1 truncate text-xs text-zinc-500">
                  {selectedTool.description}
                </p>
              </div>
              <Button
                onClick={() => inputRef.current?.click()}
                variant="outline"
                className="h-9 shrink-0 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              >
                <Upload size={14} className="mr-2" /> Upload image
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileInput}
              />
            </div>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_50%_45%,#282431_0%,#19171e_55%,#141218_100%)] p-5 transition ${dragging ? "border-violet-300 bg-violet-400/10" : "border-white/[0.08]"}`}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative w-full max-w-[720px]">
                <div
                  className={`relative mx-auto max-h-[62vh] overflow-hidden rounded-xl shadow-2xl shadow-black/40 ${uploadedPublicId ? "" : "aspect-[1.5/1]"}`}
                  style={{
                    aspectRatio: uploadedPublicId ? "1.5 / 1" : undefined,
                  }}
                >
                  {transformationProps ? (
                    <>
                      <CldImage
                        key={`${mainImageRevision}:${uploadedPublicId}:${appliedEdits.map((edit) => edit.id).join(":")}`}
                        {...transformationProps}
                      />
                      {(status === "applying" || status === "uploading") && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 backdrop-blur-sm">
                          <Loader2
                            size={29}
                            className="animate-spin text-violet-300"
                          />
                          <p className="text-sm font-medium text-white">
                            {status === "uploading"
                              ? "Uploading to Cloudinary…"
                              : "Applying Cloudinary transformation…"}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-500">
                        {status === "uploading" ? (
                          <Loader2
                            size={26}
                            className="animate-spin text-violet-300"
                          />
                        ) : (
                          <ImageIcon size={26} />
                        )}
                      </span>
                      <p className="mt-4 text-sm font-medium text-zinc-200">
                        {status === "uploading"
                          ? "Uploading your image"
                          : "Your canvas is empty"}
                      </p>
                      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
                        {status === "uploading"
                          ? "Your file is being uploaded to Cloudinary."
                          : "Drag and drop an image here, or browse to choose one. The image will be uploaded to your Cloudinary account."}
                      </p>
                      {status !== "uploading" && (
                        <Button
                          type="button"
                          onClick={() => inputRef.current?.click()}
                          variant="outline"
                          className="mt-5 h-9 rounded-xl border-white/10 bg-white/[0.04] text-xs text-zinc-200 hover:bg-white/[0.08]"
                        >
                          <Upload size={14} className="mr-2" /> Choose image
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {dragging && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed border-violet-300 bg-violet-950/60 text-sm font-medium text-violet-100">
                    <Upload size={18} className="mr-2" /> Drop image to upload
                  </div>
                )}
              </div>
              {!uploadedPublicId && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-zinc-400 backdrop-blur">
                  <span className="hidden sm:inline">
                    Drop an image anywhere or
                  </span>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="font-medium text-violet-200 hover:text-white"
                  >
                    browse files
                  </button>
                  <span className="text-zinc-600">· JPG, PNG, WEBP</span>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
              <span className="truncate">
                {filename || "No image uploaded"}
              </span>
              <span className="shrink-0 pl-3">
                {appliedEdits.length > 0
                  ? `${appliedEdits.length} edit${appliedEdits.length === 1 ? "" : "s"} applied`
                  : uploadedPublicId
                    ? "Original image"
                    : "Canvas preview"}
              </span>
            </div>
            {appliedEdits.length > 0 && (
              <div
                className="mt-3 flex flex-wrap gap-2"
                aria-label="Applied edits"
              >
                {appliedEdits.map((edit, index) => (
                  <span
                    key={edit.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-2.5 py-1 text-[10px] text-violet-100"
                  >
                    <span className="text-violet-300">{index + 1}.</span>{" "}
                    {edit.label}
                  </span>
                ))}
              </div>
            )}
            {errorMessage && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-xs leading-5 text-red-200"
              >
                {errorMessage}
              </p>
            )}
            {saveMessage && (
              <p
                role="status"
                className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2 text-xs leading-5 text-emerald-200"
              >
                {saveMessage}
              </p>
            )}
          </section>

          <StudioSettingsPanel state={state} actions={actions} />
        </div>
      </div>
    </main>
  );
}
