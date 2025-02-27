"use client";

import { useQuery } from "convex/react";

import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Newspaper } from "lucide-react";

interface ArticlesInformationProps {
  user: Doc<"users">,
}

export const ArticlesInformation = ({ user }: ArticlesInformationProps) => {
  const allArticles = useQuery(api.articles.get);

  if (allArticles === undefined) return <Spinner />;

  const userArticles = allArticles.filter(article => article.author === user.userId);

  if (userArticles.length === 0) return null;

  return (
    <>
      <div className="text-lg font-semibold flex flex-row items-center">
        Articles written
      </div>
      <div className="flex flex-col gap-y-1">
        {
          userArticles.map((article, index) => (
            <Link
              key={index}
              className="text-xs inline-flex flex-row text-left items-center"
              href={`/newsroom/${article._id}`}
            >
              <Newspaper className="mr-2" />
              {article.title}
              <span className="text-xs font-light opacity-50 inline-flex ml-2">
                ({new Date(article.date).toDateString()})
              </span>
            </Link>
          ))
        }
      </div>
    </>
  );
};