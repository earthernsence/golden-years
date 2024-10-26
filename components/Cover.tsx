"use client";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { useEdgeStore } from "@/lib/edgestore";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useImage } from "@/hooks/use-image";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({
  url,
  preview
}: CoverImageProps) => {
  const params = useParams();
  const image = useImage();
  const { edgestore } = useEdgeStore();
  const removeImage = useMutation(api.articles.removeImage);

  const onRemove = async() => {
    if (url) {
      await edgestore.publicFiles.delete({
        url,
      });
    }
    removeImage({
      id: params.articleId as Id<"articles">
    });
  };

  return (
    <div className={cn(
      "relative w-full h-[35vh] group",
      !url && "h-[12vh]",
      url && "bg-muted"
    )}>
      {/*
        Because we're checking if url exists using the boolean() method, TS doesn't actually know that this
        component only renders if url is true, so we have to specify url as string.
      */}
      {Boolean(url) && (
        <Image
          src={url as string}
          fill
          alt="cover"
          className="object-cover"
        />
      )}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => image.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            remove cover
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return (
    <Skeleton className="w-full h-[12vh]" />
  );
};