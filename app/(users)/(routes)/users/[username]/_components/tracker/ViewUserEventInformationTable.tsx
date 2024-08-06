"use client";

import { useQuery } from "convex/react";

import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";

import { columns, TrackedEvent } from "./Columns";
import { DataTable } from "./DataTable";

export const ViewUserEventInformationTable = ({ user }: { user: string }) => {
  const events = useQuery(api.events.get);

  if (!events) return <Spinner />;

  const participatedEvents = events.filter(event => event.participants.includes(user));

  const data = participatedEvents.map(event => ({
    _id: event._id,
    title: event.title,
    date: event.date,
    hours: (new Date(event.endDate || new Date().getTime()).getTime() - new Date(event.date).getTime()) / 3600000
  })) as TrackedEvent[];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};