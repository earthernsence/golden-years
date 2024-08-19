"use client";

import { faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { Button } from "@/components/ui/Button";
import Icon from "@/components/Icon";
import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useTeamEditModal } from "@/hooks/use-team-edit-modal";
import { useTeamJoinModal } from "@/hooks/use-team-join-modal";
import { useTeamLeaveModal } from "@/hooks/use-team-leave-modal";
import { useTeamMembersModal } from "@/hooks/use-team-members-modal";

interface SingleTeamProps {
  team: Doc<"teams">
}

export const SingleTeam = ({
  team
}: SingleTeamProps) => {
  const joinModal = useTeamJoinModal();
  const leaveModal = useTeamLeaveModal();
  const editModal = useTeamEditModal();

  const { userId } = useAuth();

  const membersModal = useTeamMembersModal();
  const leader = useQuery(api.users.getUserById, { id: `${team.lead}` });

  const visitor = useQuery(api.users.getUserById, { id: `${userId}` });
  const visitorTeam = visitor?.team || "";
  const isVisitorAdmin = visitor?.admin || false;

  const isMember = visitorTeam === team.teamId;

  const slotsString = () => {
    if (team.slots === undefined || team.slots === Number.MAX_VALUE) return `(${team.members.length})`;
    return `(${team.members.length}/${team.slots})`;
  };

  const canJoin = team.slots === Number.MAX_VALUE || team.slots === undefined ||
    team.members.length + 1 <= team.slots;

  if (leader === null || visitor === null) return <Spinner />;

  return (
    <div className="flex flex-col justify-start m-1 p-2 w-[calc(50%-2rem)] min-w-[22rem]
                    bg-gray-300 dark:bg-gray-600 border-4 border-gray-700 border-solid rounded-2xl"
    >
      <Image
        className="object-contain h-80 mb-4 place-self-center"
        src={team.image || "/no_image.png"}
        height={320}
        width={640}
        alt={`Team image for ${team.name}`}
      />
      <div className="font-bold text-lg inline-flex flex-row items-center">
        { team.name }
        {isVisitorAdmin && (
          <Pencil
            className="h-4 w-4 ml-2"
            role="button"
            onClick={() => editModal.onOpen(team)}
          />
        )}
      </div>
      <i>{ team.location }</i>
      <i>
        <Link
          href={team.link}
          className="underline text-sky-500 cursor-pointer"
          target="_blank"
        >
          Link to Website
        </Link>
      </i>
      <br />
      { team.description }
      <br />
      <br />
      <div className="flex flex-col justify-start w-full gap-y-2">
        {team.members && (
          <div className="flex flex-row items-center">
            <Icon icon={faUsers} onClick={() => membersModal.onOpen(team)} />
            View Members {slotsString()}
          </div>
        )}
        {leader && (
          <div className="flex flex-row items-center">
            <Link href={`/users/${leader.username}`}>
              <Icon icon={faStar} />
            </Link>
            Team led by {leader.name}
          </div>
        )}
        {!Boolean(visitorTeam) && canJoin && (
          <Button variant={"default"} onClick={() => joinModal.onOpen(team)}>
            Join Team
          </Button>
        )}
        {!Boolean(visitorTeam) && !canJoin && (
          <Button variant={"outline"} disabled>
            This Team is full!
          </Button>
        )}
        {Boolean(visitorTeam) && isMember && (
          <Button variant={"destructive"} onClick={() => leaveModal.onOpen(team)}>
            Leave Team
          </Button>
        )}
        {Boolean(visitorTeam) && !isMember && (
          <Button variant={"outline"} disabled>
            You are already a Member of another Team
          </Button>
        )}
      </div>
      <br />
    </div>
  );
};