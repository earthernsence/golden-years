"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { PastEvents } from "../PastEvents";
import { Skeleton } from "@/components/ui/Skeleton";
import Spinner from "@/components/Spinner";

interface EventsInformationProps {
  user: Doc<"users">
}

export const EventsInformation = ({ user }: EventsInformationProps) => {
  const totalHours = useQuery(api.events.getTotalHours, { events: user.events });

  if (totalHours === undefined) return <Spinner />;

  return (
    <>
      <div className="text-lg font-semibold flex flex-row items-center">
        Past events
        {
          user.events.length > 0 && totalHours > 0 && (
            <span className="text-xs font-light opacity-50 flex ml-2">
              ({totalHours?.toFixed(2)} total hours)
            </span>
          )
        }
      </div>
      <PastEvents events={user.events} />
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
        <Skeleton className="w-36 h-[14px] rounded-sm" />
        <Skeleton className="w-12 h-[14px] rounded-sm" />
      </div>
    </>
  );
};