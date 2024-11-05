"use client";

import { use, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Cover } from "@/components/Cover";
import Spinner from "@/components/Spinner";
import Toolbar from "@/components/Toolbar";

interface NewsroomArticlePageProps {
  articleId: Id<"articles">
}

const NewsroomArticlePage = ({
  params
}: { params: Promise<NewsroomArticlePageProps> }) => {
  const articleId = use(params).articleId;
  const Editor = useMemo(() => dynamic(() => import("@/components/Editor"), { ssr: false }), []);

  const article = useQuery(api.articles.getById, {
    articleId
  });

  const update = useMutation(api.articles.update);

  const onChange = (content: string) => {
    update({
      id: articleId,
      content
    });
  };

  if (article === undefined) return <Spinner />;
  if (article === null) return <div>not found</div>;

  return (
    <div className="pb-40 bg-gy-bg-light dark:bg-gy-bg-dark">
      <Cover preview url={article.image} />
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <Toolbar preview initial={article} />
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={article.content}
        />
      </div>
    </div>
  );
};

export default NewsroomArticlePage;