"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { FutureEvents } from "./_components/FutureEvents";
import { UserCard } from "./_components/UserCard";

interface UserPageProps {
  params: {
    username: string
  }
}

const UserPage = ({ params }: UserPageProps) => {
  const usernames = useQuery(api.users.usernames);
  const isUserReal = usernames?.includes(params.username);

  const { userId } = useAuth();

  const dbUser = useQuery(api.users.getUser, {
    username: params.username
  });

  if (dbUser === undefined) {
    return (
      <div className="min-h-full flex flex-col pt-40 items-center justify-center
                      text-center gap-y-8 flex-1 px-6 pb-10
                      h-full
                      dark:bg-dark
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
        No user found with name {params.username}!
      </div>
    );
  }

  const isUser = userId === dbUser.userId;

  return (
    <main className="min-h-full h-full flex flex-col pt-40">
      <section className="flex flex-col items-center justify-center
                          text-center gap-y-8 flex-1 px-6 pb-10
                          h-full w-auto
                          dark:bg-dark
                          md:justify-start"
      >
        <UserCard user={dbUser} />
        {isUser && (<FutureEvents events={dbUser.events} />)}
      </section>
    </main>
  );
};

export default UserPage;