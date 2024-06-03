"use client";

import { faArrowRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import Icon from "./Icon";
import { Skeleton } from "./ui/Skeleton";
import { useToast } from "./ui/use-toast";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useSignupModal } from "@/hooks/use-signup-modal";

const EventCard = ({
  event
}: { event: Doc<"events"> }) => {
  const { isSignedIn, userId } = useAuth();
  const { toast } = useToast();
  const signup = useSignupModal();

  const user = useQuery(api.users.getUserById, { id: `${userId}` });

  const signUp = () => {
    if (!isSignedIn || !user) {
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

    if (event?.participants.map(participant => participant.username).includes(user.username || "")) {
      toast({
        title: "You are already signed up for this event!",
        description: "You can visit your profile to see your future events."
      });
      return;
    }

    if (event.participants.length + 1 > event?.slots) {
      toast({
        title: "Sorry, this event is full.",
        description: "Try signing up for one of our other events!"
      });
      return;
    }

    signup.onOpen(event);
  };

  const getTime = () => {
    const timeAsDate = new Date(event.date);

    return `${timeAsDate.getHours()}:${timeAsDate.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="border-4 border-gray-500 flex rounded-lg
    xs:flex-col md:flex-row w-full place-items-center p-4 mb-2 md:h-40">
      <div className="flex md:w-1/4">
        <Image
          className="border-gray-300 border-2 xs:mb-4 md:mr-4 md:mb-0 flex xs:w-48 xs:h-48 md:w-32 md:h-32"
          src={event.image || "/no_image.png"}
          alt={`Event image for ${event.title}`}
          height={128} width={128}
        />
      </div>
      <div className="flex flex-col relative xs:w-5/6 md:w-1/2 xs:mb-4 md:mb-0">
        <Link href={`/events/${event.eventId}`} className="text-2xl xs:text-center md:text-left dark:text-white">
          { event.title }
        </Link>
        <div className="text-md light:text-gray-700 dark:text-gray-400 truncate">{ event.description }</div>
        <div className="text-xs light:text-gray-800 dark:text-gray-500">
          { event.location } on { new Date(event.date).toDateString() } at { getTime() }
        </div>
      </div>
      <div className="flex xs:w-1/2 md:w-1/4 xs:flex-col justify-center xs:space-y-2 md:space-y-0">
        <div className="flex flex-row items-center text-left">
          <Icon
            icon={faUser}
            link={`/users/${event.organiser.username}`}
          />
          <div className="text-md dark:text-white">Organised by { event.organiser.name }</div>
        </div>
        <div className="flex flex-row items-center text-left">
          <Icon
            icon={faArrowRightToBracket}
            onClick={signUp}
          />
          <div className="text-md dark:text-white">Sign up</div>
        </div>
      </div>
    </div>
  );
};

EventCard.Skeleton = function EventCardSkeleton() {
  return (
    <div className="border-4 border-gray-500 flex rounded-lg flex-row w-full place-items-center p-4 mb-2 md:h-40">
      <div className="flex w-1/4">
        <Skeleton className="w-32 h-32 rounded-sm" />
      </div>
      <div className="flex flex-col relative w-1/2 space-y-2">
        <Skeleton className={`w-48 h-8`} />
        <Skeleton className={`w-36 h-4`} />
        <Skeleton className={`w-24 h-2`} />
      </div>
      <div className="flex xs:w-1/2 md:w-1/4 xs:flex-col justify-center xs:space-y-2 md:space-y-2">
        <div className="flex flex-row items-center text-left space-x-2">
          <Skeleton className="w-16 h-16 rounded-sm" />
          <Skeleton className="h-4 w-48 rounded-sm" />
        </div>
        <div className="flex flex-row items-center text-left space-x-2">
          <Skeleton className="w-16 h-16 rounded-sm" />
          <Skeleton className="h-4 w-48 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;