"use client";

import Image from "next/image";

import { Skeleton } from "@/components/ui/Skeleton";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

interface SpecificEventPageProps {
  params: {
    id: string
  }
}

const SpecificEventPage = ({ params }: SpecificEventPageProps) => {
  const eventId = parseInt(params.id, 10);
  const event = useQuery(api.events.getSpecificEvent, { id: `${eventId}` });

  if (event === undefined) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center
                      text-center gap-y-8 flex-1 px-6 pb-10
                      h-full
                      dark:bg-dark
                      md:justify-start"
      >
        <SpecificEventPage.Skeleton />
      </div>
    );
  }

  if (isNaN(eventId) || event === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full">
        <div className="text-4xl">Oops!</div>
        No event found with id {params.id}!
      </div>
    );
  }

  return (
    <div className="flex flex-row w-1/2 h-2/3 bg-muted-foreground/10 rounded-md border dark:border-white p-4 gap-x-2">
      <div className="flex flex-col w-1/4">
        <div className="flex flex-col items-center gap-y-1">
          <Image
            src={event.image || "/no_image.png"}
            alt="Event image"
            className="w-36 h-36 rounded-sm border dark:border-gray-500"
            width={1024}
            height={1024}
          />
        </div>
      </div>
      <div className="flex flex-col w-3/4 gap-y-1">
        <div className="h-1/6 text-left text-sm">
          <div className="text-xl font-semibold">{event.title}</div>
        </div>
        <div className="h-1/6 text-left text-sm">
          <div className="text-lg font-semibold">Date</div>
          {new Date(event.date).toDateString()} at {new Date(event.date).toTimeString()}
        </div>
        <div className="h-1/6 text-left text-sm">
          <div className="text-lg font-semibold">Description</div>
          {event.description}
        </div>
      </div>
    </div>
  );
};

SpecificEventPage.Skeleton = function SpecificEventPageSkeleton() {
  return (
    <div className="flex flex-row w-full h-full bg-muted-foreground/10 rounded-md border gap-x-4 dark:border-white p-4">
      <div className="flex flex-col w-1/4">
        <div className="flex flex-col items-center gap-y-1">
          <Skeleton className="w-36 h-36 rounded-full" />
          <Skeleton className="w-16 h-6 rounded-sm" />
          <Skeleton className="w-14 h-4 rounded-sm" />
        </div>
      </div>
      <div className="flex flex-col w-3/4 gap-y-1">
        <div className="flex flex-col h-1/6 text-left gap-y-1">
          <Skeleton className="w-36 h-[28px] rounded-sm" />
          <Skeleton className="w-96 h-4 rounded-sm" />
        </div>
        <div className="flex flex-col h-1/6 text-left gap-y-1">
          <Skeleton className="w-40 h-[28px] rounded-sm" />
          <Skeleton className="w-72 h-4 rounded-sm" />
        </div>
        <div className="flex flex-col h-1/6 text-left gap-y-1">
          <Skeleton className="w-24 h-[28px] rounded-sm" />
          <Skeleton className="w-48 h-4 rounded-sm" />
        </div>
        <div className="flex flex-col h-1/6 text-left gap-y-1">
          <Skeleton className="w-16 h-[28px] rounded-sm" />
          <Skeleton className="w-56 h-4 rounded-sm" />
        </div>
        <div className="flex flex-col h-1/3 text-left gap-y-1">
          <Skeleton className="w-24 h-[28px] rounded-sm" />
          <Skeleton className="w-32 h-4 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default SpecificEventPage;