"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

interface PastEventsProps {
  events?: Array<string>
}

export const PastEvents = ({ events }: PastEventsProps) => {
  const allEvents = useQuery(api.events.get);

  if (!events) {
    return (
      <div className="flex text-sm">
        This user has not participated in any events.
      </div>
    );
  }

  const participatedPastEvents = allEvents
    ?.filter(event => event.date < Date.now())
    .filter(event => events.includes(event._id));

  if (participatedPastEvents === undefined || participatedPastEvents.length === 0) {
    return (
      <div className="flex text-sm">
        This user has not participated in any events.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-1">
      {
        participatedPastEvents.map((event, index) => (
          <Link
            key={index}
            className="text-xs flex flex-row text-left items-center"
            href={`/events/${event._id}`}
          >
            <Calendar className="mr-2" />
            {event.title}
          </Link>
        ))
      }
    </div>
  );
};