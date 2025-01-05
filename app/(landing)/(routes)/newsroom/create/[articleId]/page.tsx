"use client";

// Note to future readers: This file sucks, and I genuinely have no idea how any of it works.
// The autosave feature is perhaps one of the worst things I've ever coded, and I'd like it to not
// be lumped in with actually good lines of code I've written.

import { use, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";

import { DataCompressor } from "@/lib/compressor";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Cover } from "@/components/Cover";
import Spinner from "@/components/Spinner";
import Toolbar from "@/components/Toolbar";
import { useToast } from "@/components/ui/use-toast";

interface NewsroomCreatePageProps {
  articleId: Id<"articles">
}

const NewsroomCreatePage = ({
  params
}: { params: Promise<NewsroomCreatePageProps> }) => {
  const { toast } = useToast();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [content, setContent] = useState("");
  const { userId } = useAuth();
  const articleId = use(params).articleId;
  const Editor = useMemo(() => dynamic(() => import("@/components/Editor"), { ssr: false }), []);

  const article = useQuery(api.articles.getById, {
    articleId
  });

  useEffect(() => {
    if (article && article.content) {
      const articleContent = DataCompressor.deserialise(article.content);
      setContent(articleContent);
    }
  }, [article]);

  // Handles saving on refresh.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const compressedData = DataCompressor.serialise(content);

      update({
        id: articleId,
        content: compressedData
      });

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  const update = useMutation(api.articles.update);

  // THIS IS EXTREMELY VOLATILE! I have not entirely figured out how this all works, but so far,
  // it's done what I want it to do.
  const onChange = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      const compressedData = DataCompressor.serialise(content);

      update({
        id: articleId,
        content: compressedData
      });

      toast({
        title: "Article successfully saved"
      });
    }, 2000);

    setTimeoutId(newTimeoutId);
  };

  if (article === undefined) return <Spinner />;
  if (article === null) return <div>not found</div>;

  if (article.author !== userId) return <div>unauthorized! you are not the author of this article.</div>;

  const articleContent = DataCompressor.deserialise(article.content);

  return (
    <div className="pb-40 dark:bg-gy-bg-dark xs:w-11/12 md:w-1/2">
      <Cover url={article.image} />
      <div className="mx-auto">
        <Toolbar initial={article} />
        <Editor
          onChange={(input: string) => {
            setContent(input);
            onChange();
          }}
          initialContent={articleContent}
          editable={true}
        />
      </div>
    </div>
  );
};

export default NewsroomCreatePage;
