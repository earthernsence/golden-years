import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// We use middleware because we have a specific "onboarding" page that all users must use when they sign
// up for an account. All this does is ensure that before they go to any other page on the site that they
// have their account set up.
export default authMiddleware({
  afterAuth: async(auth, req: NextRequest) => {
    const { userId, sessionClaims } = auth;

    if (userId && req.nextUrl.pathname === "/onboarding") {
      return NextResponse.next();
    }

    if (!userId && !auth.isPublicRoute) return redirectToSignIn({ returnBackUrl: req.url });

    if (userId && !sessionClaims.metadata.onboardingComplete) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    if (userId && !auth.isPublicRoute) return NextResponse.next();

    if (auth.isPublicRoute) return NextResponse.next();
  },
  publicRoutes: ["/", "/about_us", "/events", "/users"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};