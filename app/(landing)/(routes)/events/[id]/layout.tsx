"use client";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Golden Years | Events",
  description: "Connecting students to opportunities",
};

const SpecificEventPageLayout = ({
  children
}: {
  children: React.ReactNode
}) => (
  <div className="h-full w-full min-w-full dark:bg-dark">
    <main className="min-h-full flex flex-col justify-start items-center dark:bg-dark">
      { children }
    </main>
  </div>
);

export default SpecificEventPageLayout;