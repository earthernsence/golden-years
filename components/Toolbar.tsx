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

  const onInput = async(val: string) => {
    setValue(val);
    await update({
      id: initial._id,
      title: val || "Untitled"
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
          className="xs:text-3xl md:text-5xl font-bold text-[#3F3F3F] dark:text-[#CFCFCF]
                    bg-transparent outline-none w-full"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] xs:text-3xl md:text-5xl font-bold
                    break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] w-full"
        >
          {initial.title}
        </div>
      )}
    </div>
  );
};

export default Toolbar;