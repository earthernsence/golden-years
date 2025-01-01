"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";

import Spinner from "@/components/Spinner";
import { ToolbarPin } from "./toolbar/ToolbarPin";
import { ToolbarPublish } from "./toolbar/ToolbarPublish";
import { ToolbarTitle } from "./toolbar/ToolbarTitle";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const ArticleToolbar = () => {
  const { userId } = useAuth();
  const params = useParams();

  const article = useQuery(api.articles.getById, { articleId: params.articleId as Id<"articles"> });

  if (!article) return <Spinner />;

  if (article.author !== userId) return null;

  return (
    <nav className="bg-gy-bg-light dark:bg-gy-bg-dark px-3 py-2 w-full flex items-center gap-x-6">
      <div className="flex items-center justify-between w-full font-normal text-sm gap-x-2">
        Editing: <ToolbarTitle initial={article} />
        <div className="flex items-center gap-x-2">
          <ToolbarPublish initialData={article} />
          <ToolbarPin initialData={article} />
        </div>
      </div>
    </nav>
  );
};