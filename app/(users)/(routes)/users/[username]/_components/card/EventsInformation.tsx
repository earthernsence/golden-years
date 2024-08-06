"use client";

import { List, Table } from "lucide-react";
import { useState } from "react";

import { Doc } from "@/convex/_generated/dataModel";

import { PastEvents } from "../PastEvents";
import { Skeleton } from "@/components/ui/Skeleton";
import { ViewUserEventInformationTable } from "../tracker/ViewUserEventInformationTable";

interface EventsInformationProps {
  isUser: boolean,
  isVisitorAdmin: boolean,
  user: Doc<"users">
}

type EventsViewOptionType = "table" | "list";

export const EventsInformation = ({ isUser, isVisitorAdmin, user }: EventsInformationProps) => {
  const [eventsView, setEventsView] = useState<EventsViewOptionType>("list");

  return (
    <>
      <div className="text-lg font-semibold flex flex-row items-center">
            Past events
        {(isUser || isVisitorAdmin) && eventsView === "list" && (
          <Table
            className="h-4 w-4 ml-2"
            role="button"
            onClick={() => setEventsView("table")}
          />
        )}
        {(isUser || isVisitorAdmin) && eventsView === "table" && (
          <List
            className="h-4 w-4 ml-2"
            role="button"
            onClick={() => setEventsView("list")}
          />
        )}
      </div>
      {eventsView === "list" && <PastEvents events={user.events} />}
      {eventsView === "table" && <ViewUserEventInformationTable user={user.userId} />}
    </>
  );
};

EventsInformation.Skeleton = function EventsInformationSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-y-1">
        <Skeleton className="w-24 h-[28px] rounded-sm" />
        <Skeleton className="w-32 h-[14px] rounded-sm" />
        <Skeleton className="w-16 h-[14px] rounded-sm" />
        <Skeleton className="w-24 h-[14px] rounded-sm" />
        <Skeleton className="w-36 h-[14px] rounded-sm" />
        <Skeleton className="w-12 h-[14px] rounded-sm" />
      </div>
    </>
  );
};