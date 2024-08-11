"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import Spinner from "@/components/Spinner";
import { UserStatisticsTable } from "./tracker/UserStatisticsTable";

export const EventsStatistics = () => {
  const data = useQuery(api.users.getUserStatistics);

  if (!data) return <Spinner />;

  const formatter = (value: number) => new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2
  }).format(value);

  return (
    <div className="flex flex-col">
      <UserStatisticsTable />
      <div className="flex xs:flex-col md:flex-row md:w-3/4 place-self-center md:justify-evenly xs:gap-y-4 md:gap-y-0">
        <div className="flex flex-col items-center">
          <span className="text-8xl font-bold">{formatter(data.overall.manhours)}</span>
          total volunteer hours
        </div>
        <div className="flex flex-col items-center">
          <span className="text-8xl font-bold">{data.overall.totalEvents}</span>
          different events
        </div>
        <div className="flex flex-col items-center">
          <span className="text-8xl font-bold">{data.overall.uniqueParticipants}</span>
          unique volunteers
        </div>
      </div>
    </div>
  );
};