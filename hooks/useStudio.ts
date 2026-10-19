"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { CldImage, type CldImageProps } from "next-cloudinary";
import { autoTagExistingImage, saveTransformedImage } from "@/actions/studio";
import {
  buildTransformation,
  isToolSlug,
  tools,
} from "@/helpers/studio-model";
import type {
  AspectRatio,
  AppliedEdit,
  CloudinaryUploadResponse,
  StudioOptions,
  StudioStatus,
  ToolSlug,
} from "@/types/studio";

export function useStudio({
  requestedTool,
  requestedPublicId,
}: StudioOptions) {
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
  const [status, setStatus] = useState<StudioStatus>("idle");
  const [background, setBackground] = useState("#f3f0ff");
  const [baselineBackgroundId, setBaselineBackgroundId] = useState("");
  const [recolorTarget, setRecolorTarget] = useState("");
  const [recolorColor, setRecolorColor] = useState("green");
  const [cameraUp, setCameraUp] = useState(60);
  const [cameraRight, setCameraRight] = useState(45);
  const [cameraFrames, setCameraFrames] = useState(36);
  const [zoomPanMaxZoom, setZoomPanMaxZoom] = useState(6.5);
  const [zoomPanDuration, setZoomPanDuration] = useState(10);
  const [transparentBackground, setTransparentBackground] = useState(true);
  const [effectAmount, setEffectAmount] = useState(50);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [transformedUrl, setTransformedUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const operationVersion = useRef(0);
  const lastRequestedPublicId = useRef(requestedPublicId);

  const selectedTool = tools.find((tool) => tool.slug === activeTool) ?? tools[0];
  const transformationPreview = buildTransformation({
    tool: activeTool,
    aspectRatio,
    prompt,
    replaceFrom,
    transparentBackground,
    background,
    effectAmount,
    baselineBackgroundId,
    recolorTarget,
    recolorColor,
    cameraUp,
    cameraRight,
    cameraFrames,
    zoomPanMaxZoom,
    zoomPanDuration,
  });

  useEffect(() => {
    if (
      requestedPublicId === undefined ||
      requestedPublicId === lastRequestedPublicId.current
    ) {
      return;
    }

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
    const uploadVersion = ++operationVersion.current;
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
      if (uploadVersion !== operationVersion.current) return;

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
      if (uploadVersion !== operationVersion.current) return;
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
      (activeTool === "object-removal" ||
        activeTool === "generative-replace" ||
        activeTool === "extract" ||
        activeTool === "generative-background-replace") &&
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
      activeTool === "baseline" &&
      baselineBackgroundId.trim() &&
      !/^[A-Za-z0-9_./-]+$/.test(baselineBackgroundId.trim())
    ) {
      setErrorMessage(
        "Use a Cloudinary public ID with only letters, numbers, dots, underscores, hyphens, or slashes.",
      );
      return;
    }
    if (
      ["extract", "generative-background-replace"].includes(activeTool) &&
      !prompt.trim()
    ) {
      setErrorMessage("Enter a prompt before applying this transformation.");
      return;
    }
    if (
      activeTool === "generative-recolor" &&
      (!recolorTarget.trim() ||
        !recolorColor.trim() ||
        !/^[A-Za-z0-9#-]+$/.test(recolorColor.trim()))
    ) {
      setErrorMessage("Enter an object to recolor and a valid color.");
      return;
    }
    if (
      activeTool === "camera-360" &&
      (![cameraUp, cameraRight, cameraFrames].every(Number.isFinite) ||
        cameraUp < -90 ||
        cameraUp > 90 ||
        cameraRight < -180 ||
        cameraRight > 180 ||
        !Number.isInteger(cameraFrames) ||
        cameraFrames < 1 ||
        cameraFrames > 120)
    ) {
      setErrorMessage("Use camera angles in range and 1–120 frames.");
      return;
    }
    if (
      activeTool === "zoom-pan" &&
      (!Number.isFinite(zoomPanMaxZoom) ||
        zoomPanMaxZoom < 1 ||
        zoomPanMaxZoom > 10 ||
        !Number.isFinite(zoomPanDuration) ||
        zoomPanDuration < 1 ||
        zoomPanDuration > 30)
    ) {
      setErrorMessage("Use a maximum zoom from 1–10 and duration from 1–30 seconds.");
      return;
    }

    const transformation = buildTransformation({
      tool: activeTool,
      aspectRatio,
      prompt,
      replaceFrom,
      transparentBackground,
      background,
      effectAmount,
      baselineBackgroundId,
      recolorTarget,
      recolorColor,
      cameraUp,
      cameraRight,
      cameraFrames,
      zoomPanMaxZoom,
      zoomPanDuration,
    });
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

  const invalidateResult = () => setErrorMessage("");

  const downloadResult = async () => {
    if (!transformedUrl) {
      setErrorMessage(
        "Wait for the transformed image to finish loading before downloading.",
      );
      return;
    }
    setErrorMessage("");
    setStatus("downloading");
    const downloadVersion = operationVersion.current;

    try {
      const response = await fetch(transformedUrl);
      if (!response.ok) {
        throw new Error("Cloudinary could not download the transformed image.");
      }
      const blob = await response.blob();
      if (downloadVersion !== operationVersion.current) return;

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
      if (downloadVersion !== operationVersion.current) return;
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
      setErrorMessage(
        "Wait for the transformed image to finish loading before saving.",
      );
      return;
    }

    const sourcePublicId = uploadedPublicId;
    const imageVersionBeingSaved = operationVersion.current;
    setErrorMessage("");
    setStatus("saving");

    try {
      const result = await saveTransformedImage(
        sourcePublicId,
        appliedEdits.map((edit) => edit.transformation),
      );
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
      if (imageVersionBeingSaved !== operationVersion.current) return;
      setStatus("idle");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not save the transformed image.",
      );
    }
  };

  const runAutoTagging = async () => {
    if (!uploadedPublicId) {
      setErrorMessage("Upload an image before running auto-tagging.");
      return;
    }

    const imageVersionBeingTagged = operationVersion.current;
    setErrorMessage("");
    setStatus("tagging");
    try {
      const result = await autoTagExistingImage(uploadedPublicId, tagConfidence);
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
      if (imageVersionBeingTagged !== operationVersion.current) return;
      setStatus("idle");
      setErrorMessage(
        error instanceof Error ? error.message : "Image auto-tagging failed.",
      );
    }
  };

  const imageVersion = operationVersion.current;
  const transformationProps: CldImageProps | null = uploadedPublicId
    ? {
        src: uploadedPublicId,
        alt: filename || uploadedPublicId,
        width: 1200,
        height: 800,
        crop: "fit",
        format: appliedEdits.some((edit) =>
          edit.transformation.includes("fl_animated,f_webp"),
        )
          ? "webp"
          : appliedEdits.some((edit) => edit.transformation.includes("/f_gif"))
            ? "gif"
            : "auto",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1200px",
        priority: true,
        fetchPriority: "high",
        rawTransformations: appliedEdits.map((edit) => edit.transformation),
        onLoad: (event) => {
          if (imageVersion !== operationVersion.current) return;
          setStatus("idle");
          setTransformedUrl(event.currentTarget.currentSrc);
        },
        onError: () => {
          if (imageVersion !== operationVersion.current) return;
          setStatus("idle");
          setErrorMessage(
            "Cloudinary could not create this transformation. Check that the feature is enabled for your account and try again.",
          );
        },
        className: "h-full w-full object-contain",
      }
    : null;

  return {
    state: {
      activeTool,
      aspectRatio,
      prompt,
      replaceFrom,
      tagConfidence,
      detectedTags,
      autoTagComplete,
      uploadedPublicId,
      filename,
      mainImageRevision,
      appliedEdits,
      dragging,
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
      errorMessage,
      saveMessage,
      transformedUrl,
      selectedTool,
      transformationPreview,
      transformationProps,
      inputRef,
    },
    actions: {
      setActiveTool: (tool: ToolSlug) => {
        setActiveTool(tool);
        setStatus("idle");
        setErrorMessage("");
      },
      setAspectRatio,
      setPrompt: (value: string) => {
        invalidateResult();
        setPrompt(value);
      },
      setReplaceFrom: (value: string) => {
        invalidateResult();
        setReplaceFrom(value);
      },
      setTagConfidence: (value: number) => setTagConfidence(value),
      setBackground: (value: string) => {
        invalidateResult();
        setBackground(value);
      },
      setBaselineBackgroundId: (value: string) => {
        invalidateResult();
        setBaselineBackgroundId(value);
      },
      setRecolorTarget: (value: string) => {
        invalidateResult();
        setRecolorTarget(value);
      },
      setRecolorColor: (value: string) => {
        invalidateResult();
        setRecolorColor(value);
      },
      setCameraUp: (value: number) => {
        invalidateResult();
        setCameraUp(value);
      },
      setCameraRight: (value: number) => {
        invalidateResult();
        setCameraRight(value);
      },
      setCameraFrames: (value: number) => {
        invalidateResult();
        setCameraFrames(value);
      },
      setZoomPanMaxZoom: (value: number) => {
        invalidateResult();
        setZoomPanMaxZoom(value);
      },
      setZoomPanDuration: (value: number) => {
        invalidateResult();
        setZoomPanDuration(value);
      },
      setTransparentBackground: (value: boolean) => {
        invalidateResult();
        setTransparentBackground(value);
      },
      setEffectAmount: (value: number) => {
        invalidateResult();
        setEffectAmount(value);
      },
      setDragging,
      onFileInput,
      onDrop,
      reset,
      runTransformation,
      runAutoTagging,
      downloadResult,
      saveResultToCloudinary,
      invalidateResult,
    },
  };
}
