"use client";

import { Doc } from "@/convex/_generated/dataModel";

import { TimeSpan } from "../formatter/TimeSpan";

import { EventsInformation } from "./EventsInformation";
import { GroupsInformation } from "./GroupsInformation";
import { Skeleton } from "@/components/ui/Skeleton";

interface UserInformationProps {
  user: Doc<"users">,
  isUser: boolean,
  team?: Doc<"teams">,
  isVisitorAdmin: boolean,
}

export const UserInformation = ({ user, isUser, team, isVisitorAdmin }: UserInformationProps) => {
  const isUserLead = user.userId === team?.lead;

  const teamString = () => {
    if (!team) return `This User is not a member of a Team.`;

    return (
      <div>
        This user is a member of the {team.name} Team{" "}
        {isUserLead && (<span className="text-gy-light dark:text-gy-dark">(Team Leader)</span>) }
      </div>
    );
  };

  return (
    <div className="flex flex-col xs:w-full md:w-3/4 gap-y-2">
      <div className="min-h-1/6 h-auto text-left text-sm">
        <div className="text-lg font-semibold">Account age</div>
        This account was created {new TimeSpan(Date.now() - user.signupTime).toStringNoDecimals()} ago
      </div>
      <br />
      <div className="min-h-1/6 h-auto text-left text-sm">
        <div className="text-lg font-semibold">Biography</div>
        {user.bio ?? "None provided..."}
      </div>
      <br />
      <div className="min-h-1/6 h-auto text-left text-sm">
        <div className="text-lg font-semibold">Location</div>
        {user.location ?? "None provided..."}
      </div>
      <br />
      <div className="min-h-1/6 h-auto text-left text-sm">
        <div className="text-lg font-semibold">Team</div>
        {teamString()}
      </div>
      <br />
      <div className="min-h-1/6 h-auto text-left text-sm">
        <GroupsInformation
          user={user}
          isVisitorAdmin={isVisitorAdmin}
          isUserLead={isUserLead}
        />
      </div>
      <br />
      <div className="h-1/3 text-left text-sm">
        <EventsInformation
          user={user}
          isUser={isUser}
          isVisitorAdmin={isVisitorAdmin}
        />
      </div>
    </div>
  );
};

UserInformation.Skeleton = function UserInformationSkeleton() {
  return (
    <div className="flex flex-col xs:w-full md:w-3/4 gap-y-2">
      <div className="flex flex-col h-1/6 text-left gap-y-1">
        <Skeleton className="w-36 h-[28px] rounded-sm" />
        <Skeleton className="xs:w-36 md:w-96 h-4 rounded-sm" />
        <Skeleton className="xs:w-36 md:w-96 h-4 rounded-sm" />
      </div>
      <div className="flex flex-col h-1/6 text-left gap-y-1">
        <Skeleton className="w-40 h-[28px] rounded-sm" />
        <Skeleton className="w-72 h-4 rounded-sm" />
      </div>
      <div className="flex flex-col h-1/6 text-left gap-y-1">
        <Skeleton className="w-24 h-[28px] rounded-sm" />
        <Skeleton className="w-48 h-4 rounded-sm" />
      </div>
      <div className="flex flex-col h-1/6 text-left gap-y-1">
        <Skeleton className="w-24 h-[28px] rounded-sm" />
        <Skeleton className="w-48 h-4 rounded-sm" />
      </div>
      <div className="flex flex-col h-1/6 text-left gap-y-1">
        <GroupsInformation.Skeleton />
      </div>
      <div className="flex flex-col h-1/3 text-left gap-y-1">
        <EventsInformation.Skeleton />
      </div>
    </div>
  );
};