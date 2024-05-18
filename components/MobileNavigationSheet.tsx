"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";

import { Page, Pages } from "./pages";
import { Separator } from "./ui/Separator";
import { Wordmark } from "./Wordmark";

const MobileNavigationSheet = () => {
  console.log("Asdf");

  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side={"top"}>
        <SheetHeader className="flex flex-row">
          <SheetTitle>
            <Link href="/">
              <Wordmark forceFull size="ExtraLarge" />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <Separator className="mt-2 mb-2" />
        <div
          className="flex text-left flex-col text-md w-full justify-start flex-wrap list-none gap-y-4"
        >
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
        <Separator className="mt-2 mb-2" />
        <div>socials</div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigationSheet;