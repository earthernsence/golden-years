"use client";

import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { useCreateEventModal } from "@/hooks/use-create-event-modal";

import { CreateEventForm, formSchema } from "@/components/modals/CreateEventForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";

import { useEdgeStore } from "@/lib/edgestore";
import { useImage } from "@/hooks/use-image";

export const CreateEventModal = () => {
  const modal = useCreateEventModal();
  const { userId } = useAuth();

  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const create = useMutation(api.events.create);

  const image = useImage();
  const { edgestore } = useEdgeStore();

  // We have to return some placeholder components here. These should never run as the modal can only be opened
  // if a user is a) signed in on the events page and b) is an admin. Type safety, however, demands that we do this.
  if (!user) return (<div className="hidden">This really shouldn&apos;t be possible.</div>);
  if (!user.admin) return (<div className="hidden">This REALLY shouldn&apos;t be possible.</div>);

  const uploadFile = async(uploadedFile?: File) => {
    if (uploadedFile) {
      const res = await edgestore.publicFiles.upload({
        file: uploadedFile,
        options: { replaceTargetUrl: image.url },
      });

      return res.url;
    }

    return undefined;
  };

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    const imageURL = await uploadFile(values.image);

    // Users can either choose not to select a team at all, or choose one and then decide
    // to *not* have a team assigned to it. There exists a "none" option on the create event form,
    // and it is represented by the value "-1".
    const eventTeam = (values.team === undefined || values.team === "-1")
      ? ""
      : values.team;

    // We also need to make sure that an Event Organiser doesn't whisk away an event.
    // We have to check that there actually is an eventTeam. If there is, then we can proceed
    // and allow the exclusive field to be whatever the user decided. If there isn't,
    // we force the event to be non-exclusive.
    const isExclusive = eventTeam ? Boolean(values.exclusive) : false;

    create({
      title: values.title,
      date: values.date.getTime(),
      description: values.description,
      image: imageURL,
      location: values.location,
      slots: parseInt(values.slots, 10),
      organiser: user.userId,
      team: eventTeam,
      exclusive: isExclusive
    });

    modal.onClose();
    image.onClose();
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-full max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Create an event
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            This information will be publicly available on the website once you complete this form.
            Please ensure that all information is accurate to the best of your abilities. You can edit the event
            from its event page after creation.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          <CreateEventForm onSubmit={onSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};