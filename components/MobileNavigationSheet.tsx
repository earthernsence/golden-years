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

import { Leaf, Page, Pages } from "./pages";
import { NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationSheetMenuTriggerStyle
} from "@/components/ui/NavigationMenu";
import Icon from "./Icon";
import { Separator } from "@/components/ui/Separator";
import { Wordmark } from "./Wordmark";

import { faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { ListItem } from "./ui/ListItem";

const MobileNavigationSheet = () => (
  <Sheet>
    <SheetTrigger>
      <Menu />
    </SheetTrigger>
    <SheetContent side={"top"} className="dark:bg-background bg-muted">
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
        <NavigationMenu>
          <NavigationMenuList
            className="flex text-left flex-col text-md w-full justify-start items-start flex-wrap list-none gap-y-2"
          >
            {
              Pages.filter(page => page.text !== "Home" && !page.leaves).map((page: Page, index: number) => (
                <Link href={page.route} legacyBehavior passHref key={index}>
                  <NavigationMenuLink className={navigationSheetMenuTriggerStyle()}>
                    {page.text}
                  </NavigationMenuLink>
                </Link>
              ))
            }
            {
              Pages.filter(page => page.leaves).map((page: Page, index: number) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuTrigger>{page.text}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul
                      className="grid md:grid-cols-2 w-[300px] md:w-[500px] lg:w-[600px] gap-3 p-4
                      bg-muted dark:bg-background"
                    >
                      {page.leaves && page.leaves.map((leaf: Leaf, i: number) => (
                        <ListItem
                          key={i}
                          title={leaf.text}
                          href={leaf.route}
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
      <Separator className="mt-2 mb-2" />
      <div className="flex flex-row w-full">
        <Icon
          icon={faInstagram}
          link={"https://www.instagram.com/goldenyearsfhhs/"}
        />
        <Icon
          icon={faMessage}
          link={"https://groupme.com/join_group/100192539/3CkxOnJA"}
        />
        <Icon
          icon={faXTwitter}
          link={"https://x.com/goldenyearsfhhs"}
        />
      </div>
    </SheetContent>
  </Sheet>
);

export default MobileNavigationSheet;