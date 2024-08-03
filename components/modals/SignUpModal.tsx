"use client";

import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { useSignupModal } from "@/hooks/use-signup-modal";

export const SignUpModal = () => {
  const signup = useSignupModal();
  const { userId } = useAuth();
  const { toast } = useToast();

  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const updateUserEvents = useMutation(api.users.updateEvents);
  const actualEvent = useQuery(api.events.getSpecificEvent, { id: signup.event?.eventId || "" });
  const updateEventParticipants = useMutation(api.events.addParticipant);

  if (!signup.event) {
    return (
      <Dialog open={signup.isOpen} onOpenChange={signup.onClose}>
        <DialogContent className="h-full max-h-[50%] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="text-lg font-medium">
              Confirm your signup
            </div>
          </DialogHeader>
          <DialogDescription className="space-y-1">
            <div className="flex items-center text-xs">
              Your information will appear on the event page under &quot;Participants&quot;, and other users
              will be able to visit your account.
            </div>
          </DialogDescription>
          <div className="text-lg text-justify w-full">
            Event not found.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // TODO: Add emailing functionality on signup. Requires DNS server.

  const formattedDate = () => {
    if (!signup.event) return "No date.";
    const date = new Date(signup.event.date);
    return `${date.toDateString()} at 
    ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const confirmSignup = () => {
    if (!user) return;
    if (!signup.event) return;
    if (!actualEvent) return;

    if (!user.username || !user.email) return;

    if (user.events?.includes(signup.event.eventId)) {
      toast({
        title: "You're already signed up for this event, silly!",
        description: "You can view your future events from your profile."
      });
      return;
    }

    const initialEvents = user?.events || [];

    updateUserEvents({
      userId: user._id,
      events: [...initialEvents, actualEvent._id]
    });

    const initialParticipants = actualEvent?.participants || [];

    updateEventParticipants({
      eventId: actualEvent._id,
      participants: [...initialParticipants, user.userId]
    });

    toast({
      title: `Successfully signed up for ${actualEvent.title}!`,
      description: `You can view your future events from your profile.`
    });

    signup.onClose();
  };

  return (
    <Dialog open={signup.isOpen} onOpenChange={signup.onClose}>
      <DialogContent className="h-full max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Confirm your signup
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            Your information will appear on the event page under &quot;Participants&quot;, and other users
            will be able to visit your account.
          </div>
        </DialogDescription>
        <div className="text-2xl text-justify w-full">
          Event Information
        </div>
        <div className="text-lg text-justify w-full">
          {signup.event.title}
        </div>
        <div className="text-sm text-justify w-full">
          {signup.event.description}
        </div>
        <div className="text-sm text-justify w-full">
          This event will take place at &quot;{signup.event.location}&quot; on {formattedDate()}.
        </div>
        <br />
        <div className="text-2xl text-justify w-full">
          Things to Know
        </div>
        <div className="text-sm text-justify w-full">
          By confirming your signup, you understand that you are planning to attend this event. If it is necessary,
          you will be able to leave this event from your user page under &quot;Future Events&quot;. Please be sure to
          notify the Event Organiser if you plan to leave the event.
          If you fail to attend this event without proper notification of the event organiser, the President
          will be notified.
          If the event is cancelled, the event organiser will notify you, likely through an email. If there is
          any change to the details of this event, the event organiser will notify you.
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => signup.onClose()}>Cancel</Button>
          <Button type="button" onClick={confirmSignup}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};