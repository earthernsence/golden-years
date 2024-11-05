"use client";

import { Pin, PinOff } from "lucide-react";
import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/Button";

interface ToolbarPinProps {
  initialData: Doc<"articles">
}

export const ToolbarPin = ({
  initialData
}: ToolbarPinProps) => {
  const update = useMutation(api.articles.update);
  const [pinned, setPinned] = useState(initialData.pinned || false);

  const pin = () => {
    if (!initialData.published) return;

    setPinned(true);
    update({
      id: initialData._id,
      pinned: true
    });
  };

  const unpin = () => {
    setPinned(false);
    update({
      id: initialData._id,
      pinned: false
    });
  };

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      onClick={() => (pinned ? unpin() : pin())}
    >
      {initialData.pinned ? (
        <>
          <PinOff className="size-4 mr-2" />
          Unpin article
        </>
      ) : (
        <>
          <Pin className="size-4 mr-2" />
          Pin article
        </>
      )}
    </Button>
  );
};