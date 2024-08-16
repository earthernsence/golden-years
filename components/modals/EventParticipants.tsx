"use client";

import { User, X } from "lucide-react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface EventParticipantsProps {
  participants?: Array<string>,
  // eslint-disable-next-line no-unused-vars
  remove: (user: Doc<"users">) => void,
}

interface RemovableParticipantProps {
  id: string,
  // eslint-disable-next-line no-unused-vars
  remove: (user: Doc<"users">) => void,
}

const RemovableParticipant = ({
  id,
  remove
}: RemovableParticipantProps) => {
  const user = useQuery(api.users.getUserById, { id });

  if (!user) return (
    <div className="text-xs flex flex-row text-left items-center">
      <User />
      User not found
    </div>
  );

  return (
    <div className="text-xs flex flex-row text-left items-center">
      {user.name}
      <X role="button" onClick={() => remove(user)} />
    </div>

  );
};

export const EventParticipants = ({
  participants,
  remove
}: EventParticipantsProps) => {
  if (participants === undefined || participants.length === 0) {
    return (
      <div className="flex text-sm">
        No users to remove
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {
        participants.map((participant: string, index: number) => (
          <RemovableParticipant id={participant} key={index} remove={remove} />
        ))
      }
    </div>
  );
};