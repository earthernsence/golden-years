import Link from "next/link";
import { User } from "lucide-react";

interface Participant {
  name: string,
  email: string,
  username: string,
}

interface ParticipantsListProps {
  participants?: Array<Participant>
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
        participants.map((participant: Participant, index: number) => (
          <Link
            key={index}
            className="text-xs flex flex-row text-left items-center"
            href={`/users/${participant.username}`}
          >
            <User />
            {participant.name}
          </Link>
        ))
      }
    </div>
  );
};