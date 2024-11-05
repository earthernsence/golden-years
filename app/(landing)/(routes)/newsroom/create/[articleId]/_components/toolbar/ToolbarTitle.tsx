"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ToolbarTitleProps {
  initial: Doc<"articles">
}

export const ToolbarTitle = ({
  initial
}: ToolbarTitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation(api.articles.update);

  const [title, setTitle] = useState(initial.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(initial.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value);
    update({
      id: initial._id,
      title: event.target.value || "Untitled"
    });
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">
            {initial?.title}
          </span>
        </Button>
      )}
    </div>
  );
};