"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useScroll } from "@/hooks/use-scroll";

import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export const Navbar = () => {
  const scrolled = useScroll();

  return (
    <div className={cn(
      "z-50 bg-background fixed top-0 flex flex-row items-center w-full p-6",
      "dark:bg-dark",
      scrolled && "border-b shadow-sm"
    )}>
      <Link href="/" className="font-semibold text-center mr-4 w-1/12">
        <Logo />
      </Link>
      <br />
      <div className="flex flex-row text-sm w-full justify-start flex-wrap list-none items-center">
        <Link
          href="/about_us"
          className="text-black dark:text-white opacity-60 hover:underline hover:opacity-100"
        >
          About Us
        </Link>
      </div>
      <div className="justify-end">
        <ThemeToggle />
      </div>
    </div>
  );
};