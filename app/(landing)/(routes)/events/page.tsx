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

  if (events === undefined) {
    return (
      <div className="place-self-center max-w-full h-full w-2/3 pt-0 pb-12 pl-16 pr-16
      dark:bg-dark xs:text-left md:text-justify">
        <EventCard.Skeleton />
      </div>
    );
  }

  return (
    <div className="place-self-center max-w-full h-full md:w-2/3 xs:w-11/12 pt-0 pb-12 md:pl-16 md:pr-16
                    dark:bg-dark xs:text-left md:text-justify">
      <div className="text-4xl pb-4 xs:text-center md:text-left">Events</div>
      {
        events?.map(event => (
          <EventCard key={event.eventId} event={event} />
        ))
      }
    </div>
  );
};

export default EventsPage;