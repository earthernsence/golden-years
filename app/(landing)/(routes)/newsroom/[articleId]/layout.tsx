// Article viewing page layout

import { Metadata } from "next";

import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Golden Years | Newsroom",
  description: "Connecting students to opportunities",
};

const ArticlePageLayout = ({
  children
}: {
  children: React.ReactNode
}) => (
  <div className="h-full bg-gy-bg-light dark:bg-gy-bg-dark w-full">
    <Navbar />
    <main className="min-h-full flex flex-col place-self-center items-center w-full h-full
                   bg-gy-bg-light dark:bg-gy-bg-dark"
    >
      { children }
    </main>
  </div>
);

export default ArticlePageLayout;