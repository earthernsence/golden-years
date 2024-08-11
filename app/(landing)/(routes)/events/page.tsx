"use client";

import { useQuery } from "convex/react";
import { useState } from "react";

import EventCard from "@/components/EventCard";

import { api } from "@/convex/_generated/api";

import { EventsPageHeader } from "./_components/EventsPageHeader";
import { EventsStatistics } from "./_components/EventsStatistics";
import { EventsView } from "./_components/EventsView";

type EventsPagePageState = "events" | "statistics";

const EventsPage = () => {
  const [page, setPage] = useState<EventsPagePageState>("events");

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
      <EventsPageHeader
        page={page}
        setPage={setPage}
      />
      {page === "statistics"
        ? (<EventsStatistics />)
        : (<EventsView />)}
    </div>
  );
};

export default EventsPage;