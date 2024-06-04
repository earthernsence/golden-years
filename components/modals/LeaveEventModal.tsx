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

import { useLeaveModal } from "@/hooks/use-leave-event-modal";

export const LeaveEventModal = () => {
  const modal = useLeaveModal();
  const { toast } = useToast();

  const { userId } = useAuth();

  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const event = useQuery(api.events.getSpecificEvent, { id: modal.event?.eventId || "" });
  const updateUserEvents = useMutation(api.users.updateEvents);
  const updateEventParticipants = useMutation(api.events.addParticipant);

  if (!modal.event) {
    return (
      <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
        <DialogContent className="h-full max-h-[50%] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="text-lg font-medium">
            Are you sure you wish to leave this event?
            </div>
          </DialogHeader>
          <DialogDescription className="space-y-1">
            <div className="flex items-center text-xs">
            You will be able to sign up again from the events page.
            </div>
          </DialogDescription>
          <div className="text-lg text-justify w-full">
            Event not found.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const onConfirm = () => {
    if (!user) return;
    if (!modal.event) return;
    if (!event) return;

    if (!user.events?.includes(modal.event.eventId)) {
      toast({
        title: "You can't un-sign-up for an event you aren't signed up for, silly!",
        description: "You can sign up for this event from the Events page."
      });
    }

    const initialEvents = user.events || [];

    updateUserEvents({
      userId: user._id,
      events: initialEvents.filter(e => e !== modal.event?.eventId)
    });

    const initialParticipants = modal.event.participants || [];

    updateEventParticipants({
      eventId: event?._id,
      participants: initialParticipants.filter(part => part !== user.userId),
    });

    toast({
      title: `Successfully un-signed-up for ${event.title}`,
      description: `You can re-sign-up from the Events page at any time.`
    });

    modal.onClose();
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Are you sure you wish to leave this event?
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            You will be able to sign up again from the events page.
          </div>
        </DialogDescription>
        <div className="text-md text-justify w-full">
          Are you sure you wish to leave {modal.event.title}? Please be sure to notify the Event Organiser
          that you will not be in attendance.
        </div>
        <DialogFooter className="flex flex-row w-full space-x-2 justify-end">
          <Button type="button" onClick={() => modal.onClose()} className="w-24">Cancel</Button>
          <Button type="button" onClick={onConfirm} variant={"destructive"} className="w-24">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};