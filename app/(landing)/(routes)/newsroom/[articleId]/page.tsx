"use client";

import { use, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { DataCompressor } from "@/lib/compressor";

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

  // This won't end up actually getting used, but we'll throw it in
  // to prevent some type wonkiness in editor
  const update = useMutation(api.articles.update);

  const onChange = (content: string) => {
    update({
      id: articleId,
      content
    });
  };

  if (article === undefined) return <Spinner />;
  if (article === null) return <div>not found</div>;

  const articleContent = DataCompressor.deserialise(article.content);

  return (
    <>
      <div className="flex md:w-2/5 xs:items-center md:items-start mb-4">
        <Link
          className="flex flex-row text-left items-center text-sm opacity-50 hover:opacity-100 hover:cursor-pointer"
          href="/newsroom"
        >
          <ArrowLeft />
          Back to Newsroom
        </Link>
      </div>
      <div className="pb-40 bg-gy-bg-light dark:bg-gy-bg-dark">
        <Cover preview url={article.image} />
        <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
          <Toolbar preview initial={article} />
          <Editor
            editable={false}
            onChange={onChange}
            initialContent={articleContent}
          />
        </div>
      </div>
    </>
  );
};

export default NewsroomArticlePage;