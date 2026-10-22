"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

type DemoSignInResult =
  | { success: true; token: string }
  | { success: false; error: string };

export async function createDemoSignInToken(): Promise<DemoSignInResult> {
  const { userId } = await auth();
  if (userId) {
    return {
      success: false,
      error: "Sign out before starting the demo.",
    };
  }

  const demoUserId = process.env.CLERK_DEMO_USER_ID?.trim();
  if (!demoUserId) {
    return {
      success: false,
      error: "Demo access is not configured.",
    };
  }

  try {
    const clerk = await clerkClient();
    const signInToken = await clerk.signInTokens.createSignInToken({
      userId: demoUserId,
      expiresInSeconds: 300,
    });

    return { success: true, token: signInToken.token };
  } catch (error) {
    console.error("Unable to create a demo sign-in token.", error);
    return {
      success: false,
      error: "Unable to start the demo session. Please try again.",
    };
  }
}
