"use client";

import { faArrowRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import Icon from "@/components/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { useSignupModal } from "@/hooks/use-signup-modal";

import { ParticipantsList } from "./_components/ParticipantsList";

interface SpecificEventPageProps {
  params: {
    id: string
  }
}

const SpecificEventPage = ({ params }: SpecificEventPageProps) => {
  const eventId = parseInt(params.id, 10);
  const event = useQuery(api.events.getSpecificEvent, { id: `${eventId}` });

  const { isSignedIn, sessionId, userId } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const signup = useSignupModal();

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
      // TODO: readd this return statement
      // return;
    }

    if (event?.participants.map(participant => participant.username).includes(user?.publicMetadata.username || "")) {
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
      <div className="flex w-1/2 items-start">
        <Link
          className="flex flex-row text-left items-center text-sm opacity-50 hover:opacity-100 hover:cursor-pointer"
          href="/events"
        >
          <ArrowLeft />
          Back to Events page
        </Link>
      </div>
      <br />
      <div className="flex flex-row w-1/2 h-2/3 bg-muted-foreground/10 rounded-md border dark:border-white p-4 gap-x-2">
        <div className="flex flex-col w-1/4">
          <div className="flex flex-col items-center gap-y-2">
            <Image
              src={event.image || "/no_image.png"}
              alt="Event image"
              className="w-36 h-36 rounded-sm border dark:border-gray-500"
              width={1024}
              height={1024}
            />
            <div className="flex flex-col text-sm">
              <div className="flex flex-row items-center text-left">
                <Icon
                  icon={faUser}
                  link={`/users/${event.organiser.username}`}
                />
                <div className="text-md text-white">Organised by { event.organiser.name }</div>
              </div>
              <div className="flex flex-row items-center text-left">
                <Icon
                  icon={faArrowRightToBracket}
                  onClick={signUp}
                />
                <div className="text-md text-white">Sign up</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-3/4 gap-y-2">
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
            <div className="text-lg font-semibold">Participants</div>
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