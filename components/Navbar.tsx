"use client";

import { SignInButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";

import { NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/NavigationMenu";
import { Button } from "@/components/ui/Button";
import { ListItem } from "@/components/ui/ListItem";
import { ThemeToggle } from "@/components/ThemeToggle";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Leaf, Page, Pages } from "./pages";
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
      "bg-gy-bg-light dark:bg-gy-bg-dark",
      "border-b shadow-sm"
    )}>
      <Link href="/" className="font-semibold flex text-center mr-6 md:w-auto">
        <Wordmark />
      </Link>
      <div className="flex md:hidden">
        <MobileNavigationSheet />
      </div>
      <br />
      <div className="flex-row text-sm w-full justify-start flex-wrap list-none items-center gap-x-6 xs:hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {
              Pages.filter(page => page.text !== "Home" && !page.leaves).map((page: Page, index: number) => (
                <Link href={page.route} legacyBehavior passHref key={index}>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-gy-bg-light dark:bg-gy-bg-dark")}>
                    {page.text}
                  </NavigationMenuLink>
                </Link>
              ))
            }
            {
              Pages.filter(page => page.leaves).map((page: Page, index: number) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuTrigger className="bg-gy-bg-light dark:bg-gy-bg-dark">
                    {page.text}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-gy-bg-light dark:bg-background">
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {page.leaves && page.leaves.map((leaf: Leaf, i: number) => (
                        <ListItem
                          key={i}
                          title={leaf.text}
                          href={leaf.route}
                          className="focus:dark:bg-gy-bg-dark"
                        >
                          {leaf.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))
            }
          </NavigationMenuList>
        </NavigationMenu>
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