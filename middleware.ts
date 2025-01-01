import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// We use middleware because we have a specific "onboarding" page that all users must use when they sign
// up for an account. All this does is ensure that before they go to any other page on the site that they
// have their account set up.

const isPublicRoute = createRouteMatcher(["/", "/about_us", "/events", "/users(.*)", "/teams", "/newsroom(.*)"]);
const isProtectedRoute = createRouteMatcher(["/newsroom/create(.*)", "/newsroom/manage"]);

export default clerkMiddleware((auth, req) => {
  const authInstance = auth();

  if (authInstance.userId && req.nextUrl.pathname === "/onboarding") {
    return NextResponse.next();
  }

  if (!authInstance.userId && !isPublicRoute(req)) return authInstance.redirectToSignIn({ returnBackUrl: req.url });
  if (!authInstance.userId && isProtectedRoute(req)) return authInstance.redirectToSignIn({ returnBackUrl: req.url });

  if (authInstance.userId && !authInstance.sessionClaims.metadata.onboardingComplete) {
    const onboardingURL = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingURL);
  }

  if (authInstance.userId && !isPublicRoute(req)) return NextResponse.next();

  if (isPublicRoute(req)) return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // eslint-disable-next-line max-len
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};