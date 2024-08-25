// Main text shown on main page. Renders the logo and a few pictures.

import { ArrowDownCircle } from "lucide-react";

export const Header = () => (
  <div className="max-w-3xl space-y-8 flex items-center flex-col md:flex-row">
    <div className="flex flex-col items-center space-y-16">
      <div className="text-2xl sm:text-4xl md:text-5xl font-bold">
        Welcome, this is{" "}
        <br />
        <span className="underline">Golden Years</span>
      </div>
      <br />
      <br />
      <div className="text-base sm:text-xl md:text-2xl font-medium">
        We are a Francis Howell High School associated club.
      </div>
      <br />
      <br />
      <div className="rounded-full border-2 dark:border-gy-text-dark size-16 flex items-center justify-center">
        <ArrowDownCircle className="rounded-full dark:text-gy-text-dark size-16" />
      </div>
    </div>
  </div>
);