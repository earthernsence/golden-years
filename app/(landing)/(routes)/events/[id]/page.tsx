"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import { faArrowRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { Button } from "@/components/ui/Button";
import Icon from "@/components/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { useSignupModal } from "@/hooks/use-signup-modal";

import { ParticipantsList } from "./_components/ParticipantsList";
import { useEditEventModal } from "@/hooks/use-edit-event-modal";

interface SpecificEventPageProps {
  params: {
    id: string
  }
}

const SpecificEventPage = ({ params }: SpecificEventPageProps) => {
  const { toast } = useToast();
  const signup = useSignupModal();
  const edit = useEditEventModal();

  const eventId = parseInt(params.id, 10);
  const event = useQuery(api.events.getSpecificEvent, { id: `${eventId}` });
  const organiser = useQuery(api.users.getUserById, { id: `${event?.organiser}` });

  const { isSignedIn, userId } = useAuth();
  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const isUserAdmin = user?.admin || false;

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

  if (!organiser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full">
        <div className="text-4xl">Oops!</div>
        There was an error loading this event. Try refreshing the page.
      </div>
    );
  }

  const signUp = () => {
    if (!isSignedIn) {
      toast({
        title: "Cannot sign up for event",
        description: "You must be signed in in order to sign up for events."
      });
      return;
    }

    if (event.date < Date.now()) {
      toast({
        title: "This event has already taken place!",
        description: `This event took place on ${new Date(event.date).toDateString()}.
        Today is ${new Date().toDateString()}.`
      });
      return;
    }

    if (user?.events?.includes(event.eventId)) {
      toast({
        title: "You are already signed up for this event!",
        description: "You can visit your profile to see your future events."
      });
      return;
    }

    if (event?.participants.length + 1 > event?.slots) {
      toast({
        title: "Sorry, this event is full.",
        description: "Try signing up for one of our other events!"
      });
      return;
    }

    signup.onOpen(event);
  };

  const formattedDate = () => {
    if (!event.date) return "No date.";
    const dateObject = new Date(event.date);
    return `${dateObject.toDateString()} at 
    ${dateObject.getHours()}:${dateObject.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="flex md:w-1/2 xs:items-center md:items-start">
        <Link
          className="flex flex-row text-left items-center text-sm opacity-50 hover:opacity-100 hover:cursor-pointer"
          href="/events"
        >
          <ArrowLeft />
          Back to Events page
        </Link>
      </div>
      <br />
      <div className="flex xs:flex-col md:flex-row p-4 xs:gap-y-2 md:gap-y-0
      xs:w-11/12 md:w-1/2 xs:h-auto md:h-2/3 bg-muted-foreground/10 rounded-md border dark:border-white gap-x-2">
        <div className="flex xs:flex-row md:flex-col xs:w-full md:w-1/4 items-center justify-center">
          <div className="flex flex-col items-center xs:gap-x-2 gap-y-2">
            <Image
              src={event.image || "/no_image.png"}
              alt="Event image"
              className="xs:w-48 xs:h-48 md:w-36 md:h-36 rounded-sm border dark:border-gray-500"
              width={1024}
              height={1024}
            />
            <div className="flex xs:flex-row xs:gap-x-2 md:gap-y-2 md:flex-col text-sm">
              <div className="flex flex-row items-center text-left">
                <Icon
                  icon={faUser}
                  link={`/users/${organiser.username}`}
                />
                <div className="text-md dark:text-white">Organised by { organiser.name }</div>
              </div>
              <div className="flex flex-row items-center text-left">
                <Icon
                  icon={faArrowRightToBracket}
                  onClick={signUp}
                />
                <div className="text-md dark:text-white">Sign up</div>
              </div>
              {isUserAdmin && (
                <div className="flex justify-center">
                  <Button variant={"ghost"} onClick={() => edit.onOpen(event)}>
                    <Pencil className="md:mr-2 h-4 w-4" /> <span className="xs:hidden md:block">Edit</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col xs:w-full md:w-3/4 gap-y-2">
          <div className="text-left text-sm">
            <div className="text-xl font-semibold">{event.title}</div>
          </div>
          <div className="text-left text-sm">
            <div className="text-lg font-semibold">Date</div>
            {formattedDate()}
          </div>
          <div className="text-left text-sm">
            <div className="text-lg font-semibold">Description</div>
            {event.description}
          </div>
          <div className="text-left text-sm">
            <div className="text-lg font-semibold">Location</div>
            {event.location}
          </div>
          <div className="text-left text-sm">
            <div className="text-lg font-semibold">
              Participants ({event.participants?.length}/{event.slots} slots filled)
            </div>
            <ParticipantsList participants={event.participants} />
          </div>
        </div>
      </div>
    </>
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