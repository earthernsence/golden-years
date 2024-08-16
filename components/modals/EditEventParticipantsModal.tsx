"use client";

import { useMutation, useQuery } from "convex/react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useEditEventParticipantsModal } from "@/hooks/use-edit-event-participants-modal";

import { AddEventParticipantForm, formSchema } from "./AddEventParticipantForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { EventParticipants } from "./EventParticipants";

export const EditEventParticipantsModal = () => {
  const modal = useEditEventParticipantsModal();
  const { toast } = useToast();

  const event = useQuery(api.events.getEventByUUID, { id: modal.event?._id });
  const updateUserEvents = useMutation(api.users.updateEvents);
  const updateEventParticipants = useMutation(api.events.addParticipant);
  const getIDFromUsername = useMutation(api.users.getUserByUsername);

  const usernames = useQuery(api.users.usernames);

  if (!modal.event || !event) {
    return (
      <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
        <DialogContent className="h-full max-h-[50%] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="text-lg font-medium">
              Edit event participants
            </div>
          </DialogHeader>
          <DialogDescription className="space-y-1">
            <div className="flex items-center text-xs">
              Add or remove participants from this event.
            </div>
          </DialogDescription>
          <div className="text-lg text-justify w-full">
            Event not found.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const remove = (user: Doc<"users">) => {
    if (!modal.event) return;
    if (!event) return;

    const initialEvents = user.events || [];

    updateUserEvents({
      userId: user._id,
      events: initialEvents.filter(e => e !== event._id)
    });

    const initialParticipants = event.participants || [];

    updateEventParticipants({
      eventId: event._id,
      participants: initialParticipants.filter(part => part !== user.userId)
    });

    toast({
      title: `Successfully removed ${user.username} (${user.name}) from this event`,
      description: "You can remove more participants if you would like."
    });
  };

  const add = async(values: z.infer<typeof formSchema>) => {
    if (!usernames || !usernames.includes(values.username)) {
      toast({
        title: "This user does not exist",
        description: "Check for any spelling errors and try again."
      });

      return;
    }

    const user = await getIDFromUsername({
      username: values.username
    });

    if (!user) {
      toast({
        title: "This user could not be found",
        description: "Check for any spelling errors and try again."
      });

      return;
    }

    if (user.events.includes(event._id)) {
      toast({
        title: "This user is already signed up for this event.",
        description: "Did you mean to type a different username?"
      });

      return;
    }

    if (event.participants.length + 1 > event.slots) {
      toast({
        title: "This event is at max capacity!",
        description: "The user could not be added successfully."
      });

      return;
    }

    const initialEvents = user.events || [];

    updateUserEvents({
      userId: user._id,
      events: [...initialEvents, event._id]
    });

    const initialParticipants = event.participants || [];

    updateEventParticipants({
      eventId: event._id,
      participants: [...initialParticipants, user.userId]
    });

    toast({
      title: `Successfully added ${user.username} (${user.name}) to this event`,
      description: "You can add more participants if you would like."
    });
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Edit Event participants
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            Add or remove participants from this event.
          </div>
        </DialogDescription>
        <Tabs defaultValue="add" className="w-full">
          <TabsList>
            <TabsTrigger value="add">Add Participant</TabsTrigger>
            <TabsTrigger value="remove">Remove Participant</TabsTrigger>
          </TabsList>
          <TabsContent value="add">
            <AddEventParticipantForm onSubmit={add} />
          </TabsContent>
          <TabsContent value="remove">
            <EventParticipants
              participants={event.participants}
              remove={remove}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};