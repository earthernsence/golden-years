"use client";

import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";

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
        <Button
          size="sm"
          className="xs:max-w-auto md:max-w-full"
          onClick={onCreate}
        >
          <Plus className="mr-2 size-4" /> Create article
        </Button>
      )}
    </div>
  );
};