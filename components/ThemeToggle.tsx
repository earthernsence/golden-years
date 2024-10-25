"use client";

import * as React from "react";
import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-gy-bg-light dark:bg-gy-bg-dark">
          <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all
                          dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-muted dark:bg-background">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light {theme === "light" && (<Check className="ml-2 size-4" />)}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark {theme === "dark" && (<Check className="ml-2 size-4" />)}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System {theme === "system" && (<Check className="ml-2 size-4" />)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}