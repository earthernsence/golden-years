"use client";

import { Doc } from "@/convex/_generated/dataModel";

import EventCard from "@/components/EventCard";

export const AllEventsViewColumn = ({ teamEvents }: { teamEvents: Array<Doc<"events">> }) => (
  <div className="flex flex-col">
    {teamEvents.map((event, index) => (
      <EventCard key={index} event={event} />
    ))}
  </div>
);