"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { User } from "lucide-react";

import { api } from "@/convex/_generated/api";

import Spinner from "@/components/Spinner";

import { useTeamMembersModal } from "@/hooks/use-team-members-modal";

export const TeamMember = ({
  member
}: { member: string }) => {
  const modal = useTeamMembersModal();

  const teamMember = useQuery(api.users.getUserById, { id: member });

  if (teamMember === null) return <Spinner />;

  if (!teamMember) return (
    <div className="text-xs flex flex-row text-left items-center">
      <User />
      User not found
    </div>
  );

  return (
    <Link
      className="text-md flex flex-row text-left items-center"
      href={`/users/${teamMember.username}`}
      onClick={modal.onClose}
    >
      <User className="mr-2" />
      {teamMember.name}
    </Link>
  );
};