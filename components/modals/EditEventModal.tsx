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

    let eventImage = modal.event.image;

    if (values.image && !values.removeImage) eventImage = await uploadFile(values.image);

    if (values.removeImage) {
      if (eventImage) {
        await edgestore.publicFiles.delete({
          url: eventImage
        }).then(async() => {
          await removeImage({ id: modal.event?.eventId });
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

    await update({
      eventId: modal.event.eventId,
      title: values.title,
      date: values.date.getTime(),
      description: values.description,
      image: eventImage,
      location: values.location,
      slots: parseInt(values.slots, 10)
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