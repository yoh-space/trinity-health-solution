import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/portal(.*)",
  "/staff(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(
  async (auth, request) => {
    if (!isProtectedRoute(request)) return;

    await auth.protect();
  },
  {
    frontendApiProxy: {
      enabled: (url) => url.hostname.endsWith(".vercel.app"),
      path: "/__clerk",
    },
  },
);

export const config = {
  matcher: [
    "/__clerk/:path*",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
