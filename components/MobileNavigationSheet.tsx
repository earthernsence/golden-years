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
import Icon from "./Icon";
import { Separator } from "./ui/Separator";
import { Wordmark } from "./Wordmark";

import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

const MobileNavigationSheet = () => (
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
      <div className="flex flex-row w-full">
        <Icon
          icon={faInstagram}
          className="w-8 h-8"
          link={"https://www.instagram.com/goldenyearsfhhs/"}
        />
        <Icon
          icon={faMessage}
          className="w-8 h-8"
          link={"https://groupme.com/join_group/100192539/3CkxOnJA"}
        />
      </div>
    </SheetContent>
  </Sheet>
);

export default MobileNavigationSheet;