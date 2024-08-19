"use client";

import { User, X } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import Spinner from "@/components/Spinner";
import { useTeamMembersModal } from "@/hooks/use-team-members-modal";

interface TeamMemberProps {
  member: string,
  // eslint-disable-next-line no-unused-vars
  remove: (user: Doc<"users">) => void,
  canEditMembers: boolean,
}

const TeamMember = ({
  member,
  remove,
  canEditMembers,
}: TeamMemberProps) => {
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
    <div className="text-md flex flex-row text-left items-center">
      <Link
        className="text-md flex flex-row text-left items-center"
        href={`/users/${teamMember.username}`}
        onClick={modal.onClose}
      >
        <User className="mr-2" />
        {teamMember.name}
      </Link>
      {canEditMembers && (<X role="button" onClick={() => remove(teamMember)} />)}
    </div>
  );
};

interface TeamMembersProps {
  members: Array<string>,
  // eslint-disable-next-line no-unused-vars
  remove: (user: Doc<"users">) => void,
  canEditMembers: boolean,
}

export const TeamMembers = ({
  members,
  remove,
  canEditMembers
}: TeamMembersProps) => {
  if (members === undefined || members.length === 0) {
    return (
      <div className="text-lg text-justify w-full">
        No members on this Team...be the first!
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {
        members.map((member: string, index: number) => (
          <TeamMember member={member} remove={remove} canEditMembers={canEditMembers} key={index} />
        ))
      }
    </div>
  );
};