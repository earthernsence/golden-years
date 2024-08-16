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
  const organiser = useQuery(api.users.getUserById, { id: `${event.organiser}` });

  const eventTeam = useQuery(api.teams.getTeamFromId, { id: event.team || "-1" });
  const isEventExclusive = event.exclusive || false;

  const isUserMember = eventTeam?.teamId === user?.team;

  const isPastEvent = event.date < Date.now();

  if (!organiser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full">
        <div className="text-4xl">Oops!</div>
        There was an error loading this event. Try refreshing the page.
      </div>
    );
  }

  const signUp = () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Cannot sign up for event",
        description: "You must be signed in in order to sign up for events."
      });
      return;
    }

    // Realistically, this shouldn't run since that button will be hidden if the event already happened.
    if (isPastEvent) {
      toast({
        title: "This event has already taken place!",
        description: `This event took place on ${new Date(event.date).toDateString()}.
        Today is ${new Date().toDateString()}.`
      });
      return;
    }

    if (event?.participants.includes(user.userId || "")) {
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

    if (isEventExclusive && !isUserMember) {
      toast({
        title: `Sorry, this event is a Team-Exclusive Event.`,
        description: `Only members of the ${eventTeam?.name} Team can join this event.`
      });
      return;
    }

    signup.onOpen(event);
  };

  const getTime = () => {
    const timeAsDate = new Date(event.date);

    return `${timeAsDate.getHours()}:${timeAsDate.getMinutes().toString().padStart(2, "0")}`;
  };

  const teamString = () => {
    if (eventTeam && !isEventExclusive) return <div>
      This Event is a &quot;{eventTeam.name}&quot; Team Event, but anybody in Golden Years can join.
    </div>;

    if (eventTeam && isEventExclusive) return <div>
      This Event is a &quot;{eventTeam.name}&quot; Team <span className="underline">exclusive</span> Event.
      Only Members of this Team can join this Event.
    </div>;

    return "";
  };

  return (
    <div className="border-4 border-gray-500 flex rounded-lg md:space-x-2
    xs:flex-col md:flex-row w-full place-items-center p-4 mb-2 md:h-40">
      <div className="flex md:w-1/4">
        <Image
          className="border-gray-300 border-2 xs:mb-4 md:mr-4 md:mb-0 flex xs:w-48 xs:h-48 md:w-32 md:h-32"
          src={event.image || "/no_image.png"}
          alt={`Event image for ${event.title}`}
          height={512} width={512}
        />
      </div>
      <div className="flex flex-col relative xs:w-5/6 md:w-1/2 xs:mb-4 md:mb-0">
        <Link href={`/events/${event._id}`} className="text-2xl xs:text-center md:text-left dark:text-white">
          { event.title }
        </Link>
        <div className="text-md light:text-gray-600 dark:text-gray-300 truncate">{ event.description }</div>
        <div className="text-sm light:text-gray-700 dark:text-gray-400">{ teamString() }</div>
        <div className="text-xs light:text-gray-800 dark:text-gray-500">
          { event.location } on { new Date(event.date).toDateString() } at { getTime() }
        </div>
      </div>
      <div className="flex xs:w-auto md:w-1/4 xs:flex-col justify-center xs:space-y-2 md:space-y-0">
        <div className="flex flex-row items-center text-left">
          <Icon
            icon={faUser}
            link={`/users/${organiser.username}`}
          />
          <div className="text-md dark:text-white">Organised by { organiser.name }</div>
        </div>
        {!isPastEvent && (
          <div className="flex flex-row items-center text-left">
            <Icon
              icon={faArrowRightToBracket}
              onClick={signUp}
            />
            <div className="text-md dark:text-white">Sign up</div>
          </div>
        )}
      </div>
    </div>
  );
};

EventCard.Skeleton = function EventCardSkeleton() {
  return (
    <div className="border-4 border-gray-500 flex rounded-lg md:space-x-2
                    xs:flex-col md:flex-row w-11/12 place-items-center p-4 mb-2 md:h-40">
      <div className="flex md:w-1/4">
        <Skeleton className="xs:mb-4 md:mr-4 md:mb-0 flex xs:w-48 xs:h-48 md:w-32 md:h-32" />
      </div>
      <div className="flex flex-col relative xs:w-5/6 md:w-1/2 xs:mb-4 md:mb-0 space-y-2 xs:items-center">
        <Skeleton className="md:w-96 xs:w-48 h-8" />
        <Skeleton className="md:w-64 xs:w-32 h-6" />
        <Skeleton className="md:w-72 xs:w-36 h-4" />
        <Skeleton className="md:w-48 xs:w-24 h-2" />
      </div>
      <div className="flex xs:w-auto md:w-1/4 xs:flex-col justify-center space-y-2">
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