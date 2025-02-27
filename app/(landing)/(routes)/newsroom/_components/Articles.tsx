"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { SingleArticle } from "./SingleArticle";
import Spinner from "@/components/Spinner";

export const Articles = () => {
  const articles = useQuery(api.articles.getPublished);

  if (!articles) return <Spinner />;

  const pinnedArticles = articles
    .filter(article => article.pinned)
    .toSorted((a, b) => b.date - a.date);
  const sortedArticles = articles
    .filter(article => !article.pinned)
    .toSorted((a, b) => b.date - a.date);

  return (
    <>
      <div className="flex xs:flex-col lg:flex-row flex-wrap w-full xs:justify-center lg:justify-evenly
                      xs:gap-y-4 lg:gap-y-0">
        {pinnedArticles && pinnedArticles.map(
          (article: Doc<"articles">, index: number) => <SingleArticle article={article} key={index} />
        )}
      </div>
      <div className="border-b-[1px] border-black/50 dark:border-white/50" />
      <div className="flex xs:flex-col lg:flex-row flex-wrap w-full xs:justify-center lg:justify-evenly
                    xs:gap-y-4 lg:gap-y-0">
        {sortedArticles && sortedArticles.map(
          (article: Doc<"articles">, index: number) => <SingleArticle article={article} key={index} />
        )}
      </div>
    </>
  );
};