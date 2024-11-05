// Base newsroom page layout

import { Metadata } from "next";

import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Golden Years | Newsroom",
  description: "Connecting students to opportunities",
};

const NewsroomLayout = ({
  children
}: { children: React.ReactNode }) => (
  <div className="h-full bg-gy-bg-light dark:bg-gy-bg-dark">
    <Navbar />
    <main className="min-h-full flex flex-col justify-start items-start w-full h-full
                    pt-40 bg-gy-bg-light dark:bg-gy-bg-dark"
    >
      { children }
    </main>
  </div>
);

export default NewsroomLayout;