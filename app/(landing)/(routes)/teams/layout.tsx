import { Metadata } from "next";

import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Golden Years | Teams",
  description: "Connecting students to opportunities",
};

const TeamsLayout = ({
  children
}: {
  children: React.ReactNode
}) => (
  <div className="h-full dark:bg-dark">
    <Navbar />
    <main className="min-h-full flex flex-col justify-start items-start w-full h-full pt-40 dark:bg-dark">
      { children }
    </main>
  </div>
);

export default TeamsLayout;