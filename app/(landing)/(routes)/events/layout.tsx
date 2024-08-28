import { Metadata } from "next";

import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Golden Years | Events",
  description: "Connecting students to opportunities",
};

const EventsLayout = ({
  children
}: {
  children: React.ReactNode
}) => (
  <div className="h-full">
    <Navbar />
    <main className="min-h-full flex flex-col justify-start items-center w-full h-full pt-40
    bg-gy-bg-light dark:bg-gy-bg-dark">
      { children }
    </main>
  </div>
);

export default EventsLayout;