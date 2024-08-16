"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import EventCard from "@/components/EventCard";

import { EventsNone } from "./EventsNone";

type EventsPageViewState = "all" | "team" | "past" | "nonexclusive";

export const EventsView = () => {
  const [view, setView] = useState<EventsPageViewState>("all");
  const events = useQuery(api.events.get);

  const { userId } = useAuth();
  const user = useQuery(api.users.getUserById, { id: `${userId}` });

  const team = user?.team || "";

  if (events === null) {
    return (
      <div className="text-3xl text-bold">
        No events found...
      </div>
    );
  }

  if (events === undefined) {
    return <EventCard.Skeleton />;
  }

  const futureEvents = events.filter(event => event.date > Date.now());
  const teamEvents = futureEvents.filter(event => event.team === team);
  const pastEvents = events.filter(event => event.date < Date.now());
  const nonExclusiveEvents = futureEvents.filter(event => !event.exclusive);

  if (futureEvents.length === 0) return <EventsNone />;

  return (
    <>
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
            <SelectItem value="nonexclusive">Viewing non- Team Exclusive Events</SelectItem>
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
      {view === "nonexclusive" && nonExclusiveEvents.map((event, index: number) => (
        <EventCard key={index} event={event} />
      ))}
    </>
  );
};