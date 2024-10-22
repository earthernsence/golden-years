"use client";

import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { FutureEvents } from "./_components/FutureEvents";
import { UserCard } from "./_components/UserCard";

interface UserPageProps {
  username: string
}

const UserPage = ({ params }: { params: Promise<UserPageProps> }) => {
  const username = React.use(params).username;
  const usernames = useQuery(api.users.usernames);
  const isUserReal = usernames?.includes(username);

  const { userId } = useAuth();

  const dbUser = useQuery(api.users.getUser, {
    username
  });

  if (dbUser === undefined) {
    return (
      <div className="min-h-full flex flex-col pt-40 items-center justify-center
                      text-center gap-y-8 flex-1 px-6 pb-10
                      h-full
                      bg-gy-bg-light dark:bg-gy-bg-dark
                      md:justify-start"
      >
        <UserCard.Skeleton />
      </div>
    );
  }

  if (!isUserReal || dbUser === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full pt-40">
        <div className="text-4xl">Oops!</div>
        No user found with name {username}!
      </div>
    );
  }

  const isUser = userId === dbUser.userId;

  return (
    <main className="min-h-full h-full flex flex-col pt-40">
      <section className="flex flex-col items-center justify-center
                          text-center gap-y-8 flex-1 px-2 pb-10
                          h-full w-auto
                          bg-gy-bg-light dark:bg-gy-bg-dark
                          md:justify-start"
      >
        <UserCard user={dbUser} isUser={isUser} />
        {isUser && (<FutureEvents events={dbUser.events} />)}
      </section>
    </main>
  );
};

export default UserPage;