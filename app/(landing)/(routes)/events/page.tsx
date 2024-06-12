"use client";

import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { Button } from "@/components/ui/Button";
import EventCard from "@/components/EventCard";

import holly from "#/holly.jpg";
import { useCreateEventModal } from "@/hooks/use-create-event-modal";

const EventsPage = () => {
  const createModal = useCreateEventModal();

  const events = useQuery(api.events.get);

  const { userId } = useAuth();
  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const isAdmin = user?.admin || false;

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

  return (
    <div className="place-self-center max-w-full h-full md:w-2/3 xs:w-11/12 pt-0 pb-12 md:pl-16 md:pr-16
                    dark:bg-dark xs:text-left md:text-justify">
      <div className="flex xs:flex-col md:flex-row md:justify-between xs:items-center pb-4">
        <div className="text-4xl xs:pb-2 md:pb-0 xs:text-center md:text-left">
          Events
        </div>
        { isAdmin && (
          <Button size="sm" onClick={createModal.onOpen} className="xs:max-w-[40%] md:max-w-full">
            <Plus className="mr-2 h-4 w-4" /> Create an Event
          </Button>
        )}
      </div>
      {
        futureEvents?.map(event => (
          <EventCard key={event.eventId} event={event} />
        ))
      }
      {futureEvents.length === 0 && (
        <>
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
        </>
      )}
    </div>
  );
};

export default EventsPage;