"use client";

import { ComponentRef, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { useImage } from "@/hooks/use-image";

import { Button } from "@/components/ui/Button";

interface ToolbarProps {
  initial: Doc<"articles">,
  preview?: boolean
}

export const Toolbar = ({
  initial,
  preview
}: ToolbarProps) => {
  const inputRef = useRef<ComponentRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initial.title);

  const update = useMutation(api.articles.update);

  const image = useImage();

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initial.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (val: string) => {
    setValue(val);
    update({
      id: initial._id,
      title: value || "Untitled"
    });
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  return (
    <div className="pl-[54px] group relative">
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initial.image && !preview && (
          <Button
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
            onClick={image.onOpen}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={e => onInput(e.target.value)}
          className="text-5xl font-bold break-words text-[#3F3F3F] dark:text-[#CFCFCF]
                    resize-none bg-transparent outline-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initial.title}
        </div>
      )}
    </div>
  );
};

export default Toolbar;