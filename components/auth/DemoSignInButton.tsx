"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { createDemoSignInToken } from "@/actions/demo";

export default function DemoSignInButton() {
  const { signIn, fetchStatus } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDemoSignIn() {
    if (loading || fetchStatus === "fetching") return;

    setLoading(true);
    setError("");

    try {
      const tokenResult = await createDemoSignInToken();
      if (!tokenResult.success) {
        throw new Error(tokenResult.error);
      }

      const ticketAttempt = await signIn.ticket({
        ticket: tokenResult.token,
      });
      if (ticketAttempt.error) {
        throw new Error("Unable to verify the demo sign-in.");
      }

      const finalizeAttempt = await signIn.finalize();
      if (finalizeAttempt.error) {
        throw new Error("Unable to complete the demo sign-in.");
      }

      window.location.assign("/studio");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to start the demo session. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDemoSignIn}
        disabled={loading || fetchStatus === "fetching"}
        className="flex h-11 w-full items-center justify-center rounded-[3px] border border-[#1f2825] bg-transparent px-4 text-sm font-semibold text-[#1f2825] transition-colors hover:bg-[#1f2825]/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Starting demo…" : "Try the demo"}
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-[#7b857e]">
        Shared demo account. Please don’t upload private images or personal
        information.
      </p>
      {error && (
        <p className="mt-3 text-center text-sm text-[#8a4f36]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
