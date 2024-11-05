// Article creation page layout

"use client";

import { ComponentRef, useRef } from "react";

import { ArticleToolbar } from "./_components/ArticleToolbar";
import { Navbar } from "@/components/Navbar";

const CreateArticleLayout = ({
  children
}: { children: React.ReactNode }) => {
  const articleToolbarRef = useRef<ComponentRef<"div">>(null);

  return (
    <div className="h-full bg-gy-bg-light dark:bg-gy-bg-dark w-full">
      <Navbar />
      <main className="min-h-full flex flex-col place-self-center items-center w-full h-full
                   bg-gy-bg-light dark:bg-gy-bg-dark"
      >
        <div
          ref={articleToolbarRef}
          className="z-[99999] w-[calc(100% - 15rem)]"
        >
          <ArticleToolbar />
        </div>
        { children }
      </main>
    </div>
  );
};

export default CreateArticleLayout;