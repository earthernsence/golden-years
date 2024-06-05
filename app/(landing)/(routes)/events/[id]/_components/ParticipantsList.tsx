"use client";

import { Participant } from "./Participant";

interface ParticipantsListProps {
  participants?: Array<string>
}

export const ParticipantsList = ({
  participants
}: ParticipantsListProps) => {
  if (participants === undefined || participants.length === 0) {
    return (
      <div className="flex text-sm">
        No members signed up...be the first!
      </div>
    );
  }

  // We have to extract a specific <Participant /> component here because we need to be able to
  // run a database query on each element in participants. The participants array is all of the user
  // IDs that are signed up for an event.

  return (
    <div className="flex flex-col">
      {
        participants.map((participant: string, index: number) => (
          <Participant participant={participant} key={index} />
        ))
      }
    </div>
  );
};