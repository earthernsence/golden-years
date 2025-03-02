"use client";

import { Pencil, Pin, PinOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "convex/react";
import { useState } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { Button } from "@/components/ui/Button";
import { PublishButton } from "./PublishButton";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface ArticlePreviewCardProps {
  article: Doc<"articles">
}

export const ArticlePreviewCard = ({
  article
}: ArticlePreviewCardProps) => {
  const { toast } = useToast();
  const [pinned, setPinned] = useState(article.pinned);

  const update = useMutation(api.articles.update);

  const pin = () => {
    if (!article.published) {
      toast({
        title: "You can't pin an unpublished article, silly!",
        description: "Try publishing and try again."
      });

      return;
    }

    setPinned(true);
    update({
      id: article._id,
      pinned: true,
    });
  };

  const unpin = () => {
    setPinned(false);
    update({
      id: article._id,
      pinned: false,
    });
  };

  return (
    <div className="rounded-md border border-slate-300 flex flex-col lg:w-[30%] xs:m-4 lg:m-0">
      <figure className="border-b border-slate-300">
        <Image
          src={article.image || "/no_image.png"}
          alt={`Image for ${article.title}`}
          className="w-auto object-cover"
          width={1024}
          height={1024}
        />
      </figure>
      <Link href={`/newsroom/${article._id}`} className="text-2xl font-semibold break-normal p-4 text-left">
        {article.title}
      </Link>
      <div className="flex flex-row justify-evenly p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link href={`/newsroom/create/${article._id}`}>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="transition-all duration-200 ease-in-out opacity-50 hover:opacity-100 hover:scale-110"
                >
                  <Pencil className="size-8" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              edit article
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <PublishButton article={article} />
            </TooltipTrigger>
            <TooltipContent>
              publish article
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => (pinned ? unpin() : pin())}
                className="transition-all duration-200 ease-in-out opacity-50 hover:opacity-100 hover:scale-110"
              >
                {pinned ? (<PinOff className="size-8" />) : (<Pin className="size-8" />)}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {pinned ? "unpin article" : "pin article"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-xs font-light text-center opacity-50 mb-2">
        last edited on {new Date(article.date).toDateString()}
      </div>
    </div>
  );
};