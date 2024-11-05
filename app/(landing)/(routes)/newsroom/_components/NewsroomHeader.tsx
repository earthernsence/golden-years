"use client";

import { AlignJustify, Pencil, Plus } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";

export const NewsroomHeader = () => {
  const router = useRouter();

  const { userId } = useAuth();
  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const isAdmin = user?.admin || false;

  const create = useMutation(api.articles.create);

  const onCreate = () => {
    create()
      .then(articleId => router.push(`/newsroom/create/${articleId}`));
  };

  return (
    <div className="flex xs:flex-col md:flex-row md:justify-between xs:items-center pb-4">
      <div className="text-4xl xs:pb-2 md:pb-0 xs:text-center md:text-left">
        Newsroom
      </div>
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="xs:max-w-auto md:max-w-full">
              <span className="sr-only">Open Menu</span>
              <Pencil className="size-4 mr-2" /> Manage articles
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <div onClick={onCreate}>
              <DropdownMenuItem role="button" className="hover:cursor-pointer">
                <Plus className="mr-2 size-4" /> Create new article
              </DropdownMenuItem>
            </div>
            <div>
              <DropdownMenuItem role="button" className="hover:cursor-pointer">
                <AlignJustify className="mr-2 size-4" /> Manage your articles
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};