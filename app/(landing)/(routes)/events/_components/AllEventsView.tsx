"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { AllEventsViewColumn } from "./AllEventsViewColumn";
import Spinner from "@/components/Spinner";

export const AllEventsView = ({ events }: { events: Array<Doc<"events">> }) => {
  const teams = useQuery(api.teams.get);

  if (!teams) {
    return <Spinner />;
  }

  const teamEvents = teams.map(team => ({
    id: team.teamId,
    name: team.name,
    events: events.filter(event => event.date > Date.now() && event.team === team.teamId),
  }));

  return (
    <div className="flex flex-row space-x-4 w-full">
      {teamEvents.map(team => (
        <div className="space-y-2 w-1/4" key={team.id}>
          <div className="text-bold text-2xl">
            {team.name}
          </div>
          <AllEventsViewColumn teamEvents={team.events} />
        </div>
      ))}
    </div>
  );
};