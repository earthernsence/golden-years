"use client";

import { faArrowRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import Icon from "@/components/Icon";

import { useLeaveModal } from "@/hooks/use-leave-event-modal";

interface FutureEventProps {
  event: Doc<"events">
}

export const FutureEvent = ({ event }: FutureEventProps) => {
  const modal = useLeaveModal();

  const organiser = useQuery(api.users.getUserById, { id: `${event.organiser}` });

  const getTime = () => {
    const timeAsDate = new Date(event.date);

    return `${timeAsDate.getHours()}:${timeAsDate.getMinutes().toString().padStart(2, "0")}`;
  };

  if (!organiser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full">
        <div className="text-4xl">Oops!</div>
        There was an error loading this event. Try refreshing the page.
      </div>
    );
  }

  return (
    <div className="border-4 border-gray-500 flex rounded-lg
    xs:flex-col md:flex-row xs:w-full md:w-3/4 place-items-center p-4 mb-2 md:h-40">
      <div className="flex flex-col relative xs:w-5/6 md:w-1/2 xs:mb-4 md:mb-0">
        <Link href={`/events/${event.eventId}`} className="text-2xl xs:text-center md:text-left dark:text-white">
          { event.title }
        </Link>
        <div className="text-md xs:text-center md:text-left light:text-gray-700 dark:text-gray-400 truncate">
          { event.description }
        </div>
        <div className="text-xs xs:text-center md:text-left light:text-gray-800 dark:text-gray-500">
          { event.location } on { new Date(event.date).toDateString() } at { getTime() }
        </div>
      </div>
      <div className="flex w-1/2 xs:flex-col items-end justify-center xs:space-y-2 md:space-y-0">
        <div className="flex flex-row items-center text-left">
          <div className="text-md dark:text-white">Organised by { organiser.name }</div>
          <Icon
            icon={faUser}
            link={`/users/${organiser.username}`}
            className="mr-0 ml-4"
          />
        </div>
        <div className="flex flex-row items-center text-left">
          <div className="text-md dark:text-white">Leave event</div>
          <Icon
            icon={faArrowRightFromBracket}
            className="mr-0 ml-4"
            onClick={() => modal.onOpen(event)}
          />
        </div>
      </div>
    </div>
  );
};