"use client";

import { ComponentRef, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { useImage } from "@/hooks/use-image";

import { Button } from "@/components/ui/Button";
import Spinner from "./Spinner";

interface ToolbarProps {
  initial: Doc<"articles">,
  preview?: boolean
}

export const Toolbar = ({
  initial,
  preview
}: ToolbarProps) => {
  const author = useQuery(api.users.getUserById, { id: initial.author });
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

  if (!author) return <Spinner />;

  return (
    <div className="pl-[54px] group relative xs:pr-[54px] md:pr-0">
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
                    bg-transparent outline-hidden w-full resize-none"
        />
      ) : (
        <>
          <div
            onClick={enableInput}
            className="pb-[11.5px] xs:text-3xl md:text-5xl font-bold
                    break-words outline-hidden text-[#3F3F3F] dark:text-[#CFCFCF] w-full"
          >
            {initial.title}
          </div>
        </>
      )}
      {preview && (
        <div className="font-bold lg:font-medium lg:mt-1 text-sm p-0 flex flex-row items-center text-gray-400">
          <div className="inline-block mt-2">
          by{" "}
            <Link href={`/users/${author.username}`} className="text-[#1b2a3d] dark:text-slate-200">
              {author.name}
            </Link>
          </div>
          <div className="text-gray-300 mx-2 inline-block mt-2">
            /
          </div>
          <div className="inline-block mt-2">
            {new Date(initial.date).toDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;