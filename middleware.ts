import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher([
  "/album(.*)",
  "/favorite(.*)",
  "/gallery(.*)",
  "/profile(.*)",
  "/studio(.*)",
]);
const isLandingRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  if (isDashboardRoute(req)) {
    await auth.protect();
    return;
  }

  if (isLandingRoute(req)) {
    const { userId } = await auth();

    if (userId) {
      return NextResponse.redirect(new URL("/studio", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
