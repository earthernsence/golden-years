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