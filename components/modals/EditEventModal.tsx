"use client";

import { useMutation } from "convex/react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/use-toast";

import { EditEventForm, formSchema } from "./EditEventForm";

import { api } from "@/convex/_generated/api";
import { useEdgeStore } from "@/lib/edgestore";
import { useEditEventModal } from "@/hooks/use-edit-event-modal";
import { useImage } from "@/hooks/use-image";

export const EditEventModal = () => {
  const modal = useEditEventModal();
  const image = useImage();

  const { toast } = useToast();
  const { edgestore } = useEdgeStore();

  const update = useMutation(api.events.update);
  const removeImage = useMutation(api.events.removeImage);

  if (!modal.event) {
    return (
      <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
        <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="text-lg font-medium">
            Edit event information
            </div>
          </DialogHeader>
          <DialogDescription className="space-y-1">
            <div className="flex items-center text-xs">
            Use this modal to edit information about this event. Please try to notify any participants of
            information changes; participants can be found on the event page.
            </div>
          </DialogDescription>
          <div className="flex flex-col justify-center items-center align-middle">
            Event could not be found.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const uploadFile = async(uploadedFile?: File) => {
    if (uploadedFile) {
      const res = await edgestore.publicFiles.upload({
        file: uploadedFile,
        options: { replaceTargetUrl: modal.event?.image },
      });

      return res.url;
    }

    return undefined;
  };

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    // In all reality, this code should never run. But because "modal.event" could technically be undefined
    // (though in our code it never should be, except for right at initialisation), we have to have this check here.
    if (!modal.event) {
      toast({
        title: "There was an issue confirming your edits.",
        description: "Refresh the page and try again."
      });

      return;
    }

    if (values.date.getTime() < Date.now()) {
      toast({
        title: "You can't edit an event into the past, silly!",
        description: "Check your edits and try again."
      });

      return;
    }

    if (values.endDate < values.date) {
      toast({
        title: "The event can't end before it starts, silly!",
        description: "Move the end date to after the start date."
      });

      return;
    }

    let eventImage = modal.event.image;

    if (values.image && !values.removeImage) eventImage = await uploadFile(values.image);

    if (values.removeImage) {
      if (eventImage) {
        await edgestore.publicFiles.delete({
          url: eventImage
        }).then(async() => {
          await removeImage({ id: modal.event?._id });
          eventImage = undefined;
        }, () => {
          toast({
            title: "There was an issue confirming your edits.",
            description: "Refresh the page and try again."
          });
        });
      } else {
        eventImage = undefined;
      }
    }

    // Users can either choose not to select a team at all, or choose one and then decide
    // to *not* have a team assigned to it. There exists a "none" option on the edit event form,
    // and it is represented by the value "-1".
    const eventTeam = (values.team === undefined || values.team === "-1")
      ? ""
      : values.team;

    // We also need to make sure that an Event Organiser doesn't whisk away an event.
    // We have to check that there actually is an eventTeam. If there is, then we can proceed
    // and allow the exclusive field to be whatever the user decided. If there isn't,
    // we force the event to be non-exclusive.
    const isExclusive = eventTeam ? values.exclusive : false;

    await update({
      id: modal.event._id,
      title: values.title,
      date: values.date.getTime(),
      description: values.description,
      image: eventImage,
      location: values.location,
      slots: parseInt(values.slots, 10),
      team: eventTeam,
      exclusive: isExclusive
    });

    modal.onClose();
    image.onClose();
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Edit event information
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            Use this modal to edit information about this event. Please try to notify any participants of
            information changes; participants can be found on the event page.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          <EditEventForm event={modal.event} onSubmit={onSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};