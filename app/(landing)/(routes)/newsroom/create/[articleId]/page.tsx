"use client";

import { use, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Cover } from "@/components/Cover";
import Spinner from "@/components/Spinner";
import Toolbar from "@/components/Toolbar";

interface NewsroomCreatePageProps {
  articleId: Id<"articles">
}

const NewsroomCreatePage = ({
  params
}: { params: Promise<NewsroomCreatePageProps> }) => {
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
    <div className="pb-40 dark:bg-gy-bg-dark xs:w-11/12 md:w-1/2">
      <Cover url={article.image} />
      <div className="mx-auto">
        <Toolbar initial={article} />
        <Editor
          onChange={onChange}
          initialContent={article.content}
          editable={true}
        />
      </div>
    </div>
  );
};

export default NewsroomCreatePage;