"use client";

import { useMutation, useQuery } from "convex/react";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { useEdgeStore } from "@/lib/edgestore";
import { useImage } from "@/hooks/use-image";
import { useTeamCreateModal } from "@/hooks/use-team-create-modal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/use-toast";

import { formSchema, TeamCreateForm } from "./TeamCreateForm";

export const TeamCreateModal = () => {
  const { toast } = useToast();

  const modal = useTeamCreateModal();
  const create = useMutation(api.teams.create);

  const preexistingGroups = useQuery(api.groups.get, { type: "all" })?.map(g => g.value);
  const preexistingTeams = useQuery(api.teams.get);

  const image = useImage();
  const { edgestore } = useEdgeStore();

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
    if (preexistingGroups?.includes(values.groupValue)) {
      toast({
        title: "Error creating Team",
        description: "You must provide a unique group value."
      });

      return;
    }

    if (preexistingTeams?.map(t => t.name).includes(values.name)) {
      toast({
        title: "Error creating Team",
        description: "You must provide a unique Team name."
      });

      return;
    }

    let slots: number = Number.MAX_VALUE;

    if (values.hasSlotCap && values.slots) slots = parseInt(values.slots, 10);

    const imageURL = await uploadFile(values.image);

    create({
      name: values.name,
      description: values.description,
      location: values.location,
      lead: values.lead,
      link: values.link,
      image: imageURL,
      groupValue: values.groupValue,
      slots
    });

    modal.onClose();
    image.onClose();

    toast({
      title: "Succesfully created a new Team",
      description: "You can join it from the Teams page."
    });
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-full max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Create a Team
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            This Team will be joinable by all members of Golden Years. It will become possible to assign Events
            to this Team. Please ensure that all information is accurate to the best of your abilities. You can edit
            the Team from the Teams page after its creation.
            <br />
            The information you provide here will be used to create the Group that appears on member profiles
            automtically. Anybody who joins this Team will have the Group appear on their profile.
            <br />
            You must assign a Team Leader. You can do this by providing the username of the Team Leader in the form.
            This will appear on their Profile in the Team section.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          <TeamCreateForm onSubmit={onSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};