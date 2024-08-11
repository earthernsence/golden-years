"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { quantify } from "@/lib/utils";

interface PastEventsProps {
  events?: Array<string>
}

const eventToHours = (event: Doc<"events">) => (
  ((new Date(event.endDate || new Date())).getTime() -
    (new Date(event.date).getTime())) / 3600000
);

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
            <span className="text-xs font-light opacity-50 flex ml-2">
              ({quantify("hour", eventToHours(event))})
            </span>
          </Link>
        ))
      }
    </div>
  );
};