"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

interface FutureEventsProps {
  events?: Array<string>
}

export const FutureEvents = ({ events }: FutureEventsProps) => {
  const allEvents = useQuery(api.events.get);

  if (!events) {
    return (
      <div className="flex text-sm">
        You have not participated in any events.
      </div>
    );
  }

  const participatedFutureEvents = allEvents
    ?.filter(event => event.date > Date.now())
    .filter(event => events.includes(event.eventId));

  if (participatedFutureEvents === undefined || participatedFutureEvents.length === 0) {
    return (
      <div className="flex text-sm">
          This user has not participated in any events.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-1/2">
      <div className="text-2xl xs:text-center md:text-left">Future Events</div>
      {
        participatedFutureEvents.map((event, index) => (
          <Link
            key={index}
            className="text-xs flex flex-row text-left items-center"
            href={`/events/${event.eventId}`}
          >
            <Calendar />
            {event.title}
          </Link>
        ))
      }
    </div>
  );
};