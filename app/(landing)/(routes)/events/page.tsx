"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import EventCard from "@/components/EventCard";

const EventsPage = () => {
  const something = true;

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
          <EventCard
            key={event.eventId}
            eventId={event.eventId}
            title={event.title}
            date={event.date}
            description={event.description}
            image={event.image}
            location={event.location}
            organiser={event.organiser}
          />
        ))
      }
    </div>
  );
};

export default EventsPage;