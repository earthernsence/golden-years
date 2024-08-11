"use client";

import { BarChart3, Plus } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import EventCard from "@/components/EventCard";

import holly from "#/holly.jpg";

import { api } from "@/convex/_generated/api";
import { useCreateEventModal } from "@/hooks/use-create-event-modal";
import { UserStatisticsTable } from "./_components/tracker/UserStatisticsTable";

type EventsPageViewState = "all" | "team" | "past";
type EventsPagePageState = "events" | "statistics";

const EventsPage = () => {
  const createModal = useCreateEventModal();

  const [view, setView] = useState<EventsPageViewState>("all");
  const [page, setPage] = useState<EventsPagePageState>("events");

  const events = useQuery(api.events.get);

  const { userId } = useAuth();
  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const isAdmin = user?.admin || false;

  const team = user?.team || "";

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

  const futureEvents = events.filter(event => event.date > Date.now());
  const teamEvents = futureEvents.filter(event => event.team === team);
  const pastEvents = events.filter(event => event.date < Date.now());

  if (page === "statistics") return (
    <div className="place-self-center max-w-full h-full md:w-2/3 xs:w-11/12 pt-0 pb-12 md:pl-16 md:pr-16
    dark:bg-dark xs:text-left md:text-justify">
      <div className="flex xs:flex-col md:flex-row md:justify-between xs:items-center pb-4">
        <div className="text-4xl xs:pb-2 md:pb-0 xs:text-center md:text-left">
            Events
        </div>
        { isAdmin && (
          <div className="flex flex-row gap-x-2">
            <Button size="sm" onClick={() => setPage("events")} className="xs:max-w-auto md:max-w-full">
              <BarChart3 className="mr-2 h-4 w-4" /> Statistics
            </Button>
            <Button size="sm" onClick={createModal.onOpen} className="xs:max-w-auto md:max-w-full">
              <Plus className="mr-2 h-4 w-4" /> Create an Event
            </Button>
          </div>
        )}
      </div>
      <UserStatisticsTable />
    </div>
  );

  if (futureEvents.length === 0) return (
    <>
      <div className="place-self-center max-w-full h-full md:w-2/3 xs:w-11/12 pt-0 pb-12 md:pl-16 md:pr-16
                    dark:bg-dark xs:text-left md:text-justify">
        <div className="flex xs:flex-col md:flex-row md:justify-between xs:items-center pb-4">
          <div className="text-4xl xs:pb-2 md:pb-0 xs:text-center md:text-left">
            Events
          </div>
          { isAdmin && (
            <div className="flex flex-row gap-x-2">
              <Button size="sm" onClick={() => setPage("statistics")} className="xs:max-w-auto md:max-w-full">
                <BarChart3 className="mr-2 h-4 w-4" /> Statistics
              </Button>
              <Button size="sm" onClick={createModal.onOpen} className="xs:max-w-auto md:max-w-full">
                <Plus className="mr-2 h-4 w-4" /> Create an Event
              </Button>
            </div>
          )}
        </div>
        <div className="flex text-4xl justify-center xs:text-center md:text-left pb-2">
          No future events planned!
        </div>
        <div className="flex text-2xl justify-center xs:text-center md:text-left">
          Contact an Event Organiser if you believe this is in error.
        </div>
        <div className="flex text-lg flex-col justify-center gap-y-2 items-center xs:text-center md:text-left">
          In the meantime, here is a picture of Holly.
          <Image
            src={holly}
            priority
            className="w-64"
            alt="Carissa's cat, Holly."
            width={2268}
            height={4032}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="place-self-center max-w-full h-full md:w-2/3 xs:w-11/12 pt-0 pb-12 md:pl-16 md:pr-16
                    dark:bg-dark xs:text-left md:text-justify">
      <div className="flex xs:flex-col md:flex-row md:justify-between xs:items-center pb-4">
        <div className="text-4xl xs:pb-2 md:pb-0 xs:text-center md:text-left">
          Events
        </div>
        { isAdmin && (
          <div className="flex flex-row gap-x-2">
            <Button size="sm" onClick={() => setPage("statistics")} className="xs:max-w-auto md:max-w-full">
              <BarChart3 className="mr-2 h-4 w-4" /> Statistics
            </Button>
            <Button size="sm" onClick={createModal.onOpen} className="xs:max-w-auto md:max-w-full">
              <Plus className="mr-2 h-4 w-4" /> Create an Event
            </Button>
          </div>
        )}
      </div>
      <div className="flex xs:justify-center md:justify-normal">
        <Select
          defaultValue={"all"}
          onValueChange={value => setView(value as EventsPageViewState)}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Events view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Viewing all Events</SelectItem>
            {team && (<SelectItem value="team">Viewing Team Events</SelectItem>)}
            <SelectItem value="past">Viewing past Events</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <br />
      {view === "all" && futureEvents?.map((event, index: number) => (
        <EventCard key={index} event={event} />
      ))}
      {view === "team" && teamEvents?.map((event, index: number) => (
        <EventCard key={index} event={event} />
      ))}
      {view === "past" && pastEvents?.map((event, index: number) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventsPage;