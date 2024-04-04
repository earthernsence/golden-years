"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useConvexAuth } from "convex/react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useScroll } from "@/hooks/use-scroll";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/Button";

import { Page, Pages } from "./pages";
import { Logo } from "./Logo";
import Spinner from "./Spinner";

export const Navbar = () => {
  const scrolled = useScroll();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className={cn(
      "z-50 bg-background fixed top-0 flex flex-row items-center w-full p-6",
      "dark:bg-dark",
      scrolled && "border-b shadow-sm"
    )}>
      <Link href="/" className="font-semibold text-center mr-4 md:w-1/12">
        <Logo />
      </Link>
      <br />
      <div className="flex-row text-sm w-full justify-start flex-wrap list-none items-center gap-x-4 xs:hidden md:flex">
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
        {isAuthenticated && !isLoading && (
          <>
            <UserButton afterSignOutUrl="/" />
            <Button variant="outline" size="sm">
              Go to profile
            </Button>
          </>
        ) }
        <ThemeToggle />
      </div>
    </div>
  );
};