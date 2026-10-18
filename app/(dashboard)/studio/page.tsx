"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ChevronDown,
  Crop,
  Eraser,
  Expand,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  ScanFace,
  Sparkles,
  Tag,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CldImage, type CldImageProps } from "next-cloudinary";
import { autoTagExistingImage, saveTransformedImage } from "./actions";

type ToolSlug =
  | "background-removal"
  | "generative-fill"
  | "object-removal"
  | "generative-replace"
  | "image-restoration"
  | "smart-crop"
  | "blur"
  | "grayscale"
  | "pixelate"
  | "tint"
  | "opacity"
  | "auto-tagging";
type AspectRatio = "1:1" | "16:9" | "9:16";
type StudioStatus =
  | "idle"
  | "uploading"
  | "applying"
  | "downloading"
  | "saving";
type AppliedEdit = {
  id: string;
  label: string;
  transformation: string;
};
type Tool = {
  slug: ToolSlug;
  label: string;
  description: string;
  icon: typeof Sparkles;
};

const tools: Tool[] = [
  {
    slug: "background-removal",
    label: "Background removal",
    description: "Isolate your subject",
    icon: ScanFace,
  },
  {
    slug: "generative-fill",
    label: "Generative fill",
    description: "Expand your canvas",
    icon: Expand,
  },
  {
    slug: "object-removal",
    label: "Object removal",
    description: "Erase distractions",
    icon: Eraser,
  },
  {
    slug: "generative-replace",
    label: "Generative replace",
    description: "Replace with a prompt",
    icon: Wand2,
  },
  {
    slug: "image-restoration",
    label: "Smart upscale",
    description: "Restore image detail",
    icon: ImagePlus,
  },
  {
    slug: "smart-crop",
    label: "Smart crop",
    description: "Remove background and crop for portrait",
    icon: Crop,
  },
  {
    slug: "blur",
    label: "Blur",
    description: "Soften image details",
    icon: Expand,
  },
  {
    slug: "grayscale",
    label: "Grayscale",
    description: "Remove image color",
    icon: ImageIcon,
  },
  {
    slug: "pixelate",
    label: "Pixelate",
    description: "Create a pixel effect",
    icon: ImagePlus,
  },
  {
    slug: "tint",
    label: "Tint",
    description: "Apply a color treatment",
    icon: Wand2,
  },
  {
    slug: "opacity",
    label: "Opacity",
    description: "Adjust image transparency",
    icon: ScanFace,
  },
  {
    slug: "auto-tagging",
    label: "Auto-tag image",
    description: "Label the uploaded image",
    icon: Tag,
  },
];

type CloudinaryUploadResponse = {
  public_id?: string;
  original_filename?: string;
  format?: string;
  error?: { message?: string };
};

type StudioPageProps = {
  searchParams?: {
    tool?: string | string[];
    publicId?: string | string[];
  };
};

const isToolSlug = (value: string | undefined): value is ToolSlug =>
  tools.some((tool) => tool.slug === value);

export default function StudioPage({ searchParams }: StudioPageProps) {
  const requestedTool = Array.isArray(searchParams?.tool)
    ? searchParams.tool[0]
    : searchParams?.tool;
  const requestedPublicId = Array.isArray(searchParams?.publicId)
    ? searchParams.publicId[0]
    : searchParams?.publicId;
  const [activeTool, setActiveTool] = useState<ToolSlug>(
    isToolSlug(requestedTool) ? requestedTool : "background-removal",
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [prompt, setPrompt] = useState("");
  const [replaceFrom, setReplaceFrom] = useState("");
  const [tagConfidence, setTagConfidence] = useState(0.75);
  const [detectedTags, setDetectedTags] = useState<string[]>([]);
  const [autoTagComplete, setAutoTagComplete] = useState(false);
  const [uploadedPublicId, setUploadedPublicId] = useState(
    requestedPublicId ?? "",
  );
  const [filename, setFilename] = useState(requestedPublicId ?? "");
  const [mainImageRevision, setMainImageRevision] = useState(0);
  const [appliedEdits, setAppliedEdits] = useState<AppliedEdit[]>([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<StudioStatus | "tagging">("idle");
  const [background, setBackground] = useState("#f3f0ff");
  const [smartCropBackgroundId, setSmartCropBackgroundId] = useState("");
  const [transparentBackground, setTransparentBackground] = useState(true);
  const [effectAmount, setEffectAmount] = useState(50);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [transformedUrl, setTransformedUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const operationVersion = useRef(0);
  const lastRequestedPublicId = useRef(requestedPublicId);

  const selectedTool =
    tools.find((tool) => tool.slug === activeTool) ?? tools[0];
  const isPromptTool = activeTool === "object-removal";
  const currentImageVersion = operationVersion.current;
  const transformationProps: CldImageProps | null = uploadedPublicId
    ? {
        src: uploadedPublicId,
        alt: filename || uploadedPublicId,
        width: 1200,
        height: 800,
        crop: "fit",
        rawTransformations: appliedEdits.map((edit) => edit.transformation),
        onLoad: (event) => {
          if (currentImageVersion !== operationVersion.current) return;
          setStatus("idle");
          setTransformedUrl(event.currentTarget.currentSrc);
        },
        onError: () => {
          if (currentImageVersion !== operationVersion.current) return;
          setStatus("idle");
          setErrorMessage(
            "Cloudinary could not create this transformation. Check that the feature is enabled for your account and try again.",
          );
        },
        className: "h-full w-full object-contain",
      }
    : null;

  useEffect(() => {
    if (
      requestedPublicId !== undefined &&
      requestedPublicId !== lastRequestedPublicId.current
    ) {
      lastRequestedPublicId.current = requestedPublicId;
      operationVersion.current += 1;
      setMainImageRevision((revision) => revision + 1);
      setUploadedPublicId(requestedPublicId);
      setFilename(requestedPublicId);
      setAppliedEdits([]);
      setDetectedTags([]);
      setAutoTagComplete(false);
      setStatus("idle");
      setErrorMessage("");
      setSaveMessage("");
      setTransformedUrl("");
    }
  }, [requestedPublicId]);

  const uploadFile = async (file?: File) => {
    if (!file) return;
    if (status === "saving") {
      setErrorMessage(
        "Wait for the current image to finish saving before uploading another.",
      );
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Choose a supported image file.");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      setErrorMessage(
        "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to upload images.",
      );
      return;
    }

    setErrorMessage("");
    setSaveMessage("");
    setStatus("uploading");
    operationVersion.current += 1;
    setDetectedTags([]);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("upload_preset", "uploads");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
        { method: "POST", body },
      );
      const result = (await response.json()) as CloudinaryUploadResponse;
      if (!response.ok || !result.public_id) {
        throw new Error(
          result.error?.message ?? "Cloudinary could not upload this image.",
        );
      }

      setUploadedPublicId(result.public_id);
      setFilename(
        `${result.original_filename ?? file.name}.${result.format ?? file.name.split(".").pop() ?? "image"}`,
      );
      setMainImageRevision((revision) => revision + 1);
      setAppliedEdits([]);
      setDetectedTags([]);
      setAutoTagComplete(false);
      setTransformedUrl("");
      setSaveMessage("");
      setStatus("idle");
    } catch (error) {
      setStatus("idle");
      setErrorMessage(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    }
  };

  const onFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    void uploadFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void uploadFile(event.dataTransfer.files?.[0]);
  };

  const runTransformation = () => {
    if (activeTool === "auto-tagging") {
      setErrorMessage("Use the auto-tagging tool to tag the current image.");
      return;
    }
    if (!uploadedPublicId) {
      setErrorMessage("Upload an image before applying a transformation.");
      return;
    }
    if (
      (isPromptTool || activeTool === "generative-replace") &&
      !prompt.trim()
    ) {
      setErrorMessage("Enter a prompt before applying this transformation.");
      return;
    }
    if (activeTool === "generative-replace" && !replaceFrom.trim()) {
      setErrorMessage("Describe the object you want to replace.");
      return;
    }
    if (
      activeTool === "smart-crop" &&
      smartCropBackgroundId.trim() &&
      !/^[A-Za-z0-9_./-]+$/.test(smartCropBackgroundId.trim())
    ) {
      setErrorMessage(
        "Use a Cloudinary public ID with only letters, numbers, dots, underscores, hyphens, or slashes.",
      );
      return;
    }

    const normalizePrompt = (value: string) =>
      value.replace(/[,;/]/g, " ").replace(/\s+/g, " ").trim();
    const transformByTool: Record<ToolSlug, () => string> = {
      "background-removal": () =>
        transparentBackground
          ? "e_background_removal"
          : `e_background_removal,b_rgb:${background.replace("#", "")}`,
      "generative-fill": () => {
        const dimensions: Record<
          AspectRatio,
          { width: number; height: number }
        > = {
          "1:1": { width: 1200, height: 1200 },
          "16:9": { width: 1200, height: 675 },
          "9:16": { width: 675, height: 1200 },
        };
        const { width, height } = dimensions[aspectRatio];
        const fillPrompt = normalizePrompt(prompt)
          ? `,e_gen_fill:prompt_${normalizePrompt(prompt)}`
          : ",e_gen_fill";
        return `c_pad,w_${width},h_${height}${fillPrompt}`;
      },
      "object-removal": () => `e_gen_remove:prompt_${normalizePrompt(prompt)}`,
      "generative-replace": () =>
        `e_gen_replace:from_${normalizePrompt(replaceFrom)};to_${normalizePrompt(prompt)}`,
      "image-restoration": () => "e_restore",
      "smart-crop": () => {
        const backgroundId = smartCropBackgroundId.trim();
        const underlay = backgroundId
          ? `/u_${backgroundId.replace(/\//g, ":")},fl_relative,w_1.0,h_1.0,c_fill`
          : "";
        return `e_background_removal${underlay}/c_auto,g_auto,ar_0.5`;
      },
      blur: () => `e_blur:${effectAmount * 8}`,
      grayscale: () => "e_grayscale",
      pixelate: () => `e_pixelate:${effectAmount * 8}`,
      tint: () => "e_tint:equalize:80:blue:blueviolet",
      opacity: () => `o_${effectAmount}`,
      "auto-tagging": () => "",
    };

    const transformation = transformByTool[activeTool]();
    setErrorMessage("");
    setSaveMessage("");
    operationVersion.current += 1;
    setStatus("applying");
    setTransformedUrl("");
    setAppliedEdits((current) => [
      ...current,
      {
        id: `${Date.now()}-${current.length}`,
        label: selectedTool.label,
        transformation,
      },
    ]);
  };

  const reset = () => {
    operationVersion.current += 1;
    setStatus("idle");
    setAppliedEdits([]);
    setPrompt("");
    setReplaceFrom("");
    setErrorMessage("");
    setSaveMessage("");
    setTransformedUrl("");
    setDetectedTags([]);
    setAutoTagComplete(false);
  };

  const invalidateResult = () => {
    setErrorMessage("");
  };

  const downloadResult = async () => {
    if (!transformedUrl) {
      setErrorMessage(
        "Wait for the transformed image to finish loading before downloading.",
      );
      return;
    }
    setErrorMessage("");
    setStatus("downloading");
    try {
      const response = await fetch(transformedUrl);
      if (!response.ok)
        throw new Error("Cloudinary could not download the transformed image.");
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${filename || "pixelmorph-image"}-edited`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
      setStatus("idle");
    } catch (error) {
      setStatus("idle");
      setErrorMessage(
        error instanceof Error ? error.message : "Image download failed.",
      );
    }
  };

  const saveResultToCloudinary = async () => {
    if (!uploadedPublicId || appliedEdits.length === 0) {
      setErrorMessage("Apply an edit before saving a new Cloudinary image.");
      return;
    }
    if (!transformedUrl) {
      setErrorMessage("Wait for the transformed image to finish loading before saving.");
      return;
    }

    const sourcePublicId = uploadedPublicId;
    const transformations = appliedEdits.map((edit) => edit.transformation);
    const imageVersionBeingSaved = operationVersion.current;
    setErrorMessage("");
    setStatus("saving");

    try {
      const result = await saveTransformedImage(sourcePublicId, transformations);
      if (imageVersionBeingSaved !== operationVersion.current) return;
      if (!result.success) {
        setStatus("idle");
        setErrorMessage(result.error);
        return;
      }

      operationVersion.current += 1;
      setUploadedPublicId(result.publicId);
      setFilename(`${filename || sourcePublicId}-edited`);
      setMainImageRevision((revision) => revision + 1);
      setAppliedEdits([]);
      setDetectedTags([]);
      setAutoTagComplete(false);
      setTransformedUrl("");
      setSaveMessage(`Saved to Cloudinary as ${result.publicId}.`);
      setStatus("idle");
    } catch (error) {
      setStatus("idle");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not save the transformed image.",
      );
    }
  };

  const runAutoTagging = async () => {
    if (!uploadedPublicId) {
      setErrorMessage("Upload an image before running auto-tagging.");
      return;
    }

    const imageBeingTagged = uploadedPublicId;
    const imageVersionBeingTagged = operationVersion.current;
    setErrorMessage("");
    setStatus("tagging");
    try {
      const result = await autoTagExistingImage(
        imageBeingTagged,
        tagConfidence,
      );
      if (imageVersionBeingTagged !== operationVersion.current) return;
      if (!result.success) {
        setStatus("idle");
        setErrorMessage(result.error);
        return;
      }

      setDetectedTags(result.tags);
      setAutoTagComplete(true);
      setStatus("idle");
    } catch (error) {
      setStatus("idle");
      setErrorMessage(
        error instanceof Error ? error.message : "Image auto-tagging failed.",
      );
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#09090c]">
      <div className="flex min-h-[calc(100vh-72px)] flex-col">
        <div className="flex min-h-[68px] items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-6">
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
              className="h-9 border-white/10 bg-transparent text-xs text-zinc-300 hover:bg-white/[0.06] hover:text-white"
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
                  className="h-9 border-white/10 bg-transparent px-3 text-xs text-zinc-300 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
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
                  className="h-9 bg-violet-500 px-3 text-xs font-semibold text-white hover:bg-violet-400 disabled:opacity-40"
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
            {/*    <Button
              onClick={() => {
                if (activeTool === "auto-tagging") {
                  void runAutoTagging();
                } else {
                  runTransformation();
                }
              }}
              disabled={
                status === "uploading" ||
                status === "applying" ||
                status === "downloading" ||
                status === "tagging" ||
                (activeTool !== "auto-tagging" && !uploadedPublicId)
              }
              className="h-9 rounded-lg bg-violet-500 px-3 text-xs font-semibold text-white hover:bg-violet-400 disabled:opacity-40 sm:px-4"
            >
              {status === "uploading" || status === "applying" || status === "tagging" ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : activeTool === "auto-tagging" ? <Tag size={14} className="mr-1.5" /> : <Sparkles size={14} className="mr-1.5" />}
              {status === "uploading"
                ? "Uploading"
                : status === "applying"
                  ? "Applying"
                  : status === "tagging"
                    ? "Tagging"
                  : activeTool === "auto-tagging"
                    ? "Auto-tag image"
                    : "Apply edit"}
            </Button> */}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
          <aside className="border-b border-white/[0.08] bg-[#0d0c11] p-4 lg:border-b-0 lg:border-r">
            <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              AI tools
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {tools.map(({ slug, label, description, icon: Icon }) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => {
                    setActiveTool(slug);
                    setStatus("idle");
                    setErrorMessage("");
                  }}
                  className={`group flex items-center gap-3 rounded-xl border p-2.5 text-left transition lg:p-3 ${activeTool === slug ? "border-violet-400/30 bg-violet-400/[0.09]" : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.035]"}`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activeTool === slug ? "bg-violet-400/15 text-violet-200" : "bg-white/[0.05] text-zinc-400 group-hover:text-zinc-200"}`}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-zinc-100">
                      {label}
                    </span>
                    <span className="mt-1 hidden truncate text-[10px] text-zinc-500 lg:block">
                      {description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-5 hidden rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 lg:block">
              <p className="text-xs font-medium text-zinc-300">
                Powered by Cloudinary
              </p>
              <p className="mt-1.5 text-[11px] leading-5 text-zinc-500">
                AI-powered transformations, ready for your creative workflow.
              </p>
            </div>
          </aside>

          <section className="flex min-h-[55vh] flex-col bg-[#111015] p-3 sm:p-5 lg:min-h-0 lg:p-6">
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
                className="h-9 shrink-0 border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white"
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
                          className="mt-5 h-9 border-white/10 bg-white/[0.04] text-xs text-zinc-200 hover:bg-white/[0.08]"
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

          <aside className="border-t border-white/[0.08] bg-[#0d0c11] p-5 lg:border-l lg:border-t-0 lg:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                {activeTool === "auto-tagging"
                  ? "Image auto-tagging"
                  : "Adjustments"}
              </h2>
              <button
                type="button"
                onClick={reset}
                aria-label="Reset adjustments"
                disabled={status === "saving"}
                className="text-xs text-zinc-500 transition hover:text-white"
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
                  <p className="text-xs font-medium text-zinc-300">
                    Current image
                  </p>
                  <p className="mt-2 truncate rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-zinc-400">
                    {uploadedPublicId ||
                      "Upload an image to enable auto-tagging"}
                  </p>
                  <p className="mt-2 text-[10px] leading-4 text-zinc-500">
                    Tags are applied directly to the image already open in
                    Studio.
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
                    onChange={(event) =>
                      setTagConfidence(Number(event.target.value))
                    }
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
                  className="h-11 w-full rounded-xl bg-violet-500 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-40"
                >
                  {status === "tagging" ? (
                    <>
                      <Loader2 size={15} className="mr-2 animate-spin" />{" "}
                      Tagging image…
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
                    <p className="rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] leading-5 text-zinc-500">
                      No Google tags met the selected confidence threshold.
                    </p>
                  )}
              </div>
            )}

            {activeTool === "background-removal" && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-medium text-zinc-300">
                  Background
                </p>
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
                  Cloudinary removes the background and applies your selected
                  output.
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
                  className="h-10 border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600"
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
                  className="h-10 border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600"
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

            {(activeTool === "blur" ||
              activeTool === "pixelate" ||
              activeTool === "opacity") && (
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <label
                    htmlFor="effect-amount"
                    className="text-xs font-medium text-zinc-300"
                  >
                    {activeTool === "blur"
                      ? "Blur strength"
                      : activeTool === "pixelate"
                        ? "Pixel size"
                        : "Opacity"}
                  </label>
                  <span className="text-xs tabular-nums text-zinc-500">
                    {effectAmount}%
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
              </div>
            )}

            {activeTool === "tint" && (
              <p className="mt-7 rounded-xl border border-white/10 bg-white/[0.025] p-3 text-xs leading-5 text-zinc-400">
                Apply Cloudinary&apos;s blue-violet equalize tint effect to your
                image.
              </p>
            )}

            {activeTool === "image-restoration" && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-medium text-zinc-300">
                  Enhancement
                </p>
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
              <div className="mt-7">
                <label
                  htmlFor="smart-crop-background"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Background image public ID{" "}
                  <span className="text-zinc-600">(optional)</span>
                </label>
                <Input
                  id="smart-crop-background"
                  value={smartCropBackgroundId}
                  onChange={(event) => {
                    invalidateResult();
                    setSmartCropBackgroundId(event.target.value);
                  }}
                  placeholder="e.g. buildings_bg"
                  className="h-10 border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-zinc-600"
                />
                <p className="mt-2 text-[11px] leading-5 text-zinc-500">
                  Optionally place a Cloudinary image behind the subject. The
                  tool removes the current image&apos;s background and
                  smart-crops it to a 1:2 phone portrait.
                </p>
              </div>
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
                  (activeTool === "generative-replace" &&
                    (!replaceFrom.trim() || !prompt.trim()))
                }
                className="h-11 w-full rounded-xl bg-violet-500 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-40"
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
                  {activeTool === "background-removal"
                    ? "e_background_removal"
                    : activeTool === "generative-fill"
                      ? `c_pad,e_gen_fill${prompt.trim() ? `:${prompt.trim()}` : ""}`
                      : activeTool === "object-removal"
                        ? `e_gen_remove:${prompt.trim() || "{object}"}`
                        : activeTool === "generative-replace"
                          ? `e_gen_replace:from_${replaceFrom.trim() || "{object}"}:to_${prompt.trim() || "{replacement}"}`
                          : activeTool === "image-restoration"
                            ? "e_restore"
                            : activeTool === "smart-crop"
                              ? `e_background_removal${smartCropBackgroundId.trim() ? `/u_${smartCropBackgroundId.trim().replace(/\//g, ":")},fl_relative,w_1.0,h_1.0,c_fill` : ""}/c_auto,g_auto,ar_0.5`
                              : activeTool === "blur"
                                ? `e_blur:${effectAmount * 8}`
                                : activeTool === "grayscale"
                                  ? "e_grayscale"
                                  : activeTool === "pixelate"
                                    ? `e_pixelate:${effectAmount * 8}`
                                    : activeTool === "tint"
                                      ? "e_tint:equalize:80:blue:blueviolet"
                                      : `o_${effectAmount}`}
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
                        <span className="shrink-0 text-violet-300">
                          {index + 1}.
                        </span>
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
              Generative AI effects require the corresponding Cloudinary
              features to be enabled for your account.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
