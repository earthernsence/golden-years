"use client";

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({
  children
}: {
  children: ReactNode
}) => (
  <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    afterSignOutUrl="/"
    signInUrl="/"
    signUpUrl="/onboarding"
  >
    <ConvexProviderWithClerk
      useAuth={useAuth}
      client={convex}
    >
      { children }
    </ConvexProviderWithClerk>
  </ClerkProvider>
);