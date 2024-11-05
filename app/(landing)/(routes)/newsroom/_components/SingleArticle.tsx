"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";

import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface SingleArticleProps {
  article: Doc<"articles">
}

// TODO: Add author getting in component
export const SingleArticle = ({
  article
}: SingleArticleProps) => {
  const author = useQuery(api.users.getUserById, { id: article.author });

  if (!author) return <Spinner />;

  return (
    <div className="first:shadow-none w-full lg:w-1/2 float-left mt-0 ">
      <article className="border-t-0 mt-0 p-0 h-full block">
        <div className="my-0 mx-auto flex h-full xs:py-2 lg:p-5 lg:items-center w-full relative">
          <div className="min-w-fit">
            <Image
              src={author.image || "/no_image.png"}
              alt={`Image for ${author.name}`}
              className="size-24 p-4 object-cover"
              width={1024}
              height={1024}
            />
          </div>
          <div className="sm:pr-2 sm:py-3 max-w-full flex-grow-[2] flex-shrink mt-0">
            <div className="font-normal xs:text-lg lg:text-xl max-w-full mt-0 block">
              <Link href={`/newsroom/${article._id}`}>
                {article.title}
              </Link>
            </div>
            <div className="font-bold lg:font-medium lg:mt-1 text-sm p-0 flex flex-row items-center text-gray-400">
              <div className="inline-block mt-2">
              by <Link href={`/users/jroyvibes`} className="text-[#1b2a3d] dark:text-slate-200">jroyvibes</Link>
              </div>
              <div className="text-gray-300 mx-2 inline-block mt-2">
              /
              </div>
              <div className="mr-4 inline-block mt-2">
                {new Date(article.date).toDateString()}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};