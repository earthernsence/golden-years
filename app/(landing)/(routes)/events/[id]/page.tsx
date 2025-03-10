"use client";

import { ArrowLeft, Mail, Pencil, X } from "lucide-react";
import { faArrowRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { Button } from "@/components/ui/Button";
import { DeleteEventConfirmModal } from "@/components/modals/DeleteEventConfirmModal";
import Icon from "@/components/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { useEditEventModal } from "@/hooks/use-edit-event-modal";
import { useSignupModal } from "@/hooks/use-signup-modal";

import { ParticipantsList } from "./_components/ParticipantsList";
import { pluralise } from "@/lib/utils";
import { useEditEventParticipantsModal } from "@/hooks/use-edit-event-participants-modal";

interface SpecificEventPageProps {
  id: Id<"events">
}

const SpecificEventPage = ({ params }: { params: Promise<SpecificEventPageProps> }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const signup = useSignupModal();
  const edit = useEditEventModal();
  const participants = useEditEventParticipantsModal();

  const id = React.use(params).id;

  const event = useQuery(api.events.getEventByUUID, { id });
  const participantEmails = useQuery(api.events.getEmailAddresses, { id });
  const organiser = useQuery(api.users.getUserById, { id: `${event?.organiser}` });
  const remove = useMutation(api.events.remove);

  const { isSignedIn, userId } = useAuth();
  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const isUserAdmin = user?.admin || false;

  const eventTeam = useQuery(api.teams.getTeamFromId, { id: event?.team || "-1" });
  const isEventExclusive = event?.exclusive || false;

  const isUserMember = eventTeam?.teamId === user?.team;

  if (event === undefined) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center
                      text-center gap-y-8 flex-1 px-6 pb-10
                      h-full
                      bg-gy-bg-light dark:bg-gy-bg-dark
                      md:justify-start"
      >
        <SpecificEventPage.Skeleton />
      </div>
    );
  }

  if (!id || event === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full">
        <div className="text-4xl">Oops!</div>
        No event found with id {id}!
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

    if (user?.events?.includes(event._id)) {
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

    if (isEventExclusive && !isUserMember) {
      toast({
        title: `Sorry, this event is a Team-Exclusive Event.`,
        description: `Only members of the ${eventTeam?.name} Team can join this event.`
      });
      return;
    }

    signup.onOpen(event);
  };

  const onDelete = async() => {
    if (!event) {
      toast({
        title: "Could not delete event",
        description: "This event could not be found"
      });

      return;
    }

    if (event.date < Date.now()) {
      toast({
        title: "You can't delete past events!",
        description: "This event has already taken place, so you cannot delete it."
      });

      return;
    }

    if (event.image) {
      await edgestore.publicFiles.delete({
        url: event.image
      });
    }

    await remove({
      id: event._id
    });

    if (id === event._id) {
      router.push("/events");
    }
  };

  const formattedDate = () => {
    if (!event.date || !event.endDate) return "No date.";
    const dateObject = new Date(event.date);
    const endDateObject = new Date(event.endDate);
    const distance = (endDateObject.getTime() - dateObject.getTime()) / 3600000;
    return `${dateObject.toDateString()} from 
    ${dateObject.getHours()}:${dateObject.getMinutes().toString().padStart(2, "0")} to
    ${endDateObject.getHours()}:${endDateObject.getMinutes().toString().padStart(2, "0")}
    (${distance.toFixed(1)} ${pluralise("hour", distance)})`;
  };

  const copyContent = async() => {
    try {
      if (!participantEmails) {
        toast({
          title: "The emails could not be copied",
          description: "Refresh the page and try again."
        });
        return;
      }
      await navigator.clipboard.writeText(participantEmails.join(", "));
      toast({
        title: "Successfully copied participant emails to clipboard",
      });
    } catch (err) {
      toast({
        title: "Emails could not be copied to clipboard",
        description: `Refresh the page and try again. ${err}`
      });
    }
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
              className="xs:size-48 md:size-36 rounded-sm border object-cover dark:border-gray-500"
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
            </div>
            {isUserAdmin && (
              <div className="flex justify-center flex-row">
                <Button variant={"ghost"} onClick={() => edit.onOpen(event)}>
                  <Pencil className="mr-2 size-4" /> Edit
                </Button>
                <DeleteEventConfirmModal onConfirm={onDelete}>
                  <Button variant={"ghost"}>
                    <X className="mr-2 size-4" /> Delete
                  </Button>
                </DeleteEventConfirmModal>
              </div>
            )}

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
          {eventTeam && (
            <div className="text-left text-sm">
              <div className="text-lg font-semibold">Team</div>
              {teamString()}
            </div>
          )}
          <div className="text-left text-sm">
            <div className="text-lg font-semibold">Location</div>
            {event.location}
          </div>
          <div className="text-left text-sm">
            <div className="text-lg font-semibold flex flex-row items-center">
              Participants ({event.participants?.length}/{event.slots} slots filled)
              {isUserAdmin && event?.participants.length >= 1 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Mail
                        className="ml-2 size-4"
                        role="button"
                        onClick={copyContent}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">Copy email list to clipboard</div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {isUserAdmin && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Pencil
                        className="ml-2 size-4"
                        role="button"
                        onClick={() => participants.onOpen(event)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">Edit participants</div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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
          <Skeleton className="size-36 rounded-full" />
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