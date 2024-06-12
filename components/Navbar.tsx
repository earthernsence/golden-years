"use client";

import { SignInButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Page, Pages } from "./pages";
import MobileNavigationSheet from "./MobileNavigationSheet";
import Spinner from "./Spinner";
import { Wordmark } from "./Wordmark";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { userId } = useAuth();

  const dbUser = useQuery(api.users.getUserById, { id: `${userId}` });

  return (
    <div className={cn(
      "z-50 bg-background fixed top-0 flex flex-row items-center w-full p-6",
      "dark:bg-dark",
      "border-b shadow-sm"
    )}>
      <Link href="/" className="font-semibold flex text-center mr-4 md:w-1/12">
        <Wordmark />
      </Link>
      <div className="flex md:hidden">
        <MobileNavigationSheet />
      </div>
      <br />
      <div className="flex-row text-sm w-full justify-start flex-wrap list-none items-center gap-x-6 xs:hidden md:flex">
        {
          Pages.filter(page => page.text !== "Home").map((page: Page, index: number) => (
            <Link
              className="text-black dark:text-white dark:opacity-60 hover:underline hover:opacity-100"
              href={page.route}
              key={index}
            >
              { page.text }
            </Link>
          ))
        }
      </div>
      <div className="flex items-center gap-x-2 ml-auto justify-end">
        {isLoading && (
          <Spinner />
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton
              mode="modal"
              afterSignInUrl="/"
              afterSignUpUrl="/onboarding"
            >
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton
              mode="modal"
              afterSignInUrl="/"
              afterSignUpUrl="/onboarding"
            >
              <Button variant="ghost" size="sm">
                Sign up
              </Button>
            </SignUpButton>
          </>
        )}
        {isAuthenticated && !isLoading && dbUser && (
          <>
            <UserButton afterSignOutUrl="/" />
            <Link href={`/users/${dbUser.username}`}>
              <Button variant="outline" size="sm">
                Go to profile
              </Button>
            </Link>
          </>
        ) }
        <ThemeToggle />
      </div>
    </div>
  );
};