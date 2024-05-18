"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import EventCard from "@/components/EventCard";

const EventsPage = () => {
  const events = useQuery(api.events.get);

  if (events === null) {
    return (
      <div className="text-3xl text-bold">
        No events found...
      </div>
    );
  }

  return (
    <div className="place-self-center max-w-7xl h-full pt-0 pb-12 pl-16 pr-16
                    dark:bg-dark xs:text-left md:text-justify">
      {
        events?.map(event => (
          <EventCard key={event.eventId} event={event} />
        ))
      }
    </div>
  );
};

export default EventsPage;