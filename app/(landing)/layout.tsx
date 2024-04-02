import { Metadata } from "next";

import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "App name",
  description: "Volunteering, in a snap",
};

const LandingLayout = ({
  children
}: {
  children: React.ReactNode
}) => (
  <div className="h-full dark:bg-dark">
    <Navbar />
    <main className="h-full pt-40">
      { children }
    </main>
  </div>
);

export default LandingLayout;