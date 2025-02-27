"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { ArticlePreviewCard } from "./_components/ArticlePreviewCard";
import Spinner from "@/components/Spinner";

export const ManageArticlesPage = () => {
  const { userId } = useAuth();
  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const articles = useQuery(api.articles.get);

  if (!user || !articles) return <Spinner />;

  const userArticles = articles
    .filter(article => article.author === userId)
    .toSorted((a, b) => b._creationTime - a._creationTime);

  return (
    <div className="place-self-center max-w-full h-full md:w-3/4 xs:w-[95%] pt-0 pb-12 md:pl-16 md:pr-16
                    bg-gy-bg-light dark:bg-gy-bg-dark xs:text-left md:text-justify">
      <div className="flex md:w-2/5 xs:items-center md:items-start mb-4">
        <Link
          className="flex flex-row text-left items-center text-sm opacity-50 hover:opacity-100 hover:cursor-pointer"
          href="/newsroom"
        >
          <ArrowLeft />
          Back to Newsroom
        </Link>
      </div>
      <div className="text-4xl pb-0 xs:text-center md:text-left">
        Manage your articles
      </div>
      <br />
      <div className="flex xs:flex-col md:flex-row flex-wrap justify-evenly gap-y-4">
        {userArticles && userArticles.map((article, index) =>
          <ArticlePreviewCard article={article} key={index} />
        )}
      </div>
    </div>
  );
};

export default ManageArticlesPage;