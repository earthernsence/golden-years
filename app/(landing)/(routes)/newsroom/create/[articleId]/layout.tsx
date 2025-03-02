// Article creation page layout

"use client";

import { Navbar } from "@/components/Navbar";

const CreateArticleLayout = ({
  children
}: { children: React.ReactNode }) => (
  <div className="h-full bg-gy-bg-light dark:bg-gy-bg-dark w-full">
    <Navbar />
    <main className="min-h-full flex flex-col place-self-center items-center w-full h-full
                   bg-gy-bg-light dark:bg-gy-bg-dark"
    >
      { children }
    </main>
  </div>
);

export default CreateArticleLayout;