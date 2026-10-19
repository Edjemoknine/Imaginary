"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { serachResults } from "@/app/(dashboard)/gallery/page";
import { deleteImageFromCloudinary } from "@/components/shared/actions";

type Props = {
  image: serachResults;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export default function DeleteImageDialog({
  image,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const deleteImage = async () => {
    setIsDeleting(true);
    setErrorMessage("");
    try {
      const result = await deleteImageFromCloudinary(image.public_id);
      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

      onOpenChange(false);
      onDeleted();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not delete this image from Cloudinary.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isDeleting) {
          setErrorMessage("");
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-white/[0.08] bg-[#141319] p-0 text-zinc-100 shadow-2xl shadow-black/50 sm:max-w-[440px]">
        <DialogHeader>
          <div className="border-b border-white/[0.08] bg-gradient-to-br from-rose-500/[0.10] to-violet-500/[0.04] p-5 pr-12">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/[0.08] text-rose-200">
              <AlertTriangle size={18} />
            </span>
            <DialogTitle className="mt-4 text-base font-semibold text-white">
              Delete this image?
            </DialogTitle>
            <DialogDescription className="mt-2 break-all text-xs leading-5 text-zinc-400">
              This permanently deletes <span className="text-zinc-200">{image.public_id}</span> from Cloudinary. This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="p-5">
          {errorMessage && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3 py-2 text-xs leading-5 text-rose-200"
            >
              {errorMessage}
            </p>
          )}
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void deleteImage()}
              className="h-10 rounded-xl bg-rose-500 px-4 text-xs font-semibold text-white shadow-lg shadow-rose-950/30 hover:bg-rose-400"
            >
              {isDeleting ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : (
                <Trash2 size={14} className="mr-2" />
              )}
              {isDeleting ? "Deleting…" : "Delete image"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
