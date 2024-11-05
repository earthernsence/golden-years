"use client";

import { Check, Copy, Globe } from "lucide-react";
import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/use-origin";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";

interface ToolbarPublishProps {
  initialData: Doc<"articles">
}

export const ToolbarPublish = ({
  initialData
}: ToolbarPublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.articles.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/newsroom/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    update({
      id: initialData._id,
      published: true,
    }).finally(() => setIsSubmitting(false));
  };

  const onUnpublish = () => {
    setIsSubmitting(true);

    update({
      id: initialData._id,
      published: false,
    }).finally(() => setIsSubmitting(false));
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          publish to Newsroom
          {initialData.published && (
            <Globe className="text-sky-500 size-4 ml-2 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.published ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse size-6" />
              <p>this article is live</p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe
              className="h-8 w-8 text-muted-foreground mb-2"
            />
            <p className="text-sm font-medium mb-2">
              publish this article
            </p>
            <span className="text-xs text-muted-foreground mb-4">
              share a piece of your mind with others
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};