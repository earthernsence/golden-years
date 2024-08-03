"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { FutureEvent } from "./FutureEvent";

interface FutureEventsProps {
  events?: Array<string>
}

export const FutureEvents = ({ events }: FutureEventsProps) => {
  const allEvents = useQuery(api.events.get);

  if (!events) {
    return (
      <div className="flex text-sm">
        You have not participated in any events. Sign up for one{" "}
        <Link className="ml-1 underline text-sky-500 cursor-pointer" href={`/events`}>here</Link>!
      </div>
    );
  }

  const participatedFutureEvents = allEvents
    ?.filter(event => event.date > Date.now())
    .filter(event => events.includes(event._id));

  if (participatedFutureEvents === undefined || participatedFutureEvents.length === 0) {
    return (
      <div className="text-sm">
        You have not signed up for any future events.
        Sign up for one{" "}
        <Link className="underline text-sky-500 cursor-pointer inline-flex" href={`/events`}>here</Link>!
        <br />
        If you did, it would appear here for your reference.
      </div>
    );
  }

  return (
    <div className="flex flex-col xs:w-full md:w-1/2">
      <div className="text-2xl font-semibold text-center mb-2">Future Events</div>
      <div className="flex flex-col items-center space-y-4">
        {
          participatedFutureEvents.map((event, index) => (
            <FutureEvent event={event} key={index} />
          ))
        }
      </div>
    </div>
  );
};