"use client";

import { faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useTeamJoinModal } from "@/hooks/use-team-join-modal";
import { useTeamLeaveModal } from "@/hooks/use-team-leave-modal";
import { useTeamMembersModal } from "@/hooks/use-team-members-modal";

import { Button } from "@/components/ui/Button";
import Icon from "@/components/Icon";
import Spinner from "@/components/Spinner";

interface SingleTeamButtonsSectionProps {
  team: Doc<"teams">
};

export const SingleTeamButtonsSection = ({
  team
}: SingleTeamButtonsSectionProps) => {
  const joinModal = useTeamJoinModal();
  const leaveModal = useTeamLeaveModal();
  const membersModal = useTeamMembersModal();

  const leader = useQuery(api.users.getUserById, { id: `${team.lead}` });

  const { userId } = useAuth();
  const visitor = useQuery(api.users.getUserById, { id: `${userId}` });
  const visitorTeam = visitor?.team || "";
  const isMember = visitorTeam === team.teamId;

  const slotsString = () => {
    if (team.slots === undefined || team.slots === Number.MAX_VALUE) return `(${team.members.length})`;
    return `(${team.members.length}/${team.slots})`;
  };

  const canJoin = team.slots === Number.MAX_VALUE || team.slots === undefined ||
    team.members.length + 1 <= team.slots;

  if (!leader || !visitor) return <Spinner />;

  return (
    <div className="flex flex-col justify-start w-full gap-y-2">
      <div className="flex flex-row items-center">
        <Icon icon={faUsers} onClick={() => membersModal.onOpen(team)} />
        View Members {slotsString()}
      </div>
      <div className="flex flex-row items-center">
        <Link href={`/users/${leader.username}`}>
          <Icon icon={faStar} />
        </Link>
          Team led by {leader.name}
      </div>
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
  );
};