"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { User } from "lucide-react";

import { api } from "@/convex/_generated/api";

export const Participant = ({
  participant
}: { participant: string }) => {
  const user = useQuery(api.users.getUserById, { id: participant });

  if (!user) return (
    <div className="text-xs flex flex-row text-left items-center">
      <User />
      User not found
    </div>
  );

  return (
    <Link
      className="text-xs flex flex-row text-left items-center"
      href={`/users/${user.username}`}
    >
      <User />
      {user.name}
    </Link>
  );
};