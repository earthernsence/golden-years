"use client";

import { useMutation, useQuery } from "convex/react";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { useEdgeStore } from "@/lib/edgestore";
import { useImage } from "@/hooks/use-image";
import { useTeamEditModal } from "@/hooks/use-team-edit-modal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/use-toast";

import { formSchema, TeamEditForm } from "./TeamEditForm";

export const TeamEditModal = () => {
  const modal = useTeamEditModal();
  const image = useImage();

  const { toast } = useToast();
  const { edgestore } = useEdgeStore();

  const team = useQuery(api.teams.getTeamFromId, { id: `${modal.team?.teamId}` });

  const update = useMutation(api.teams.update);
  const removeImage = useMutation(api.teams.removeImage);

  const preexistingTeams = useQuery(api.teams.get);

  if (!team) {
    return (
      <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
        <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
          <DialogTitle className="border-b pb-3">
            <div className="text-lg font-medium">
            Edit Team information
            </div>
          </DialogTitle>
          <DialogDescription className="space-y-1">
            <div className="flex items-center text-xs">
              Use this modal to edit information about this Team. Your edits will be publicly available on this Team.
              <br />
              This Team will be joinable by all members of Golden Years. It will become possible to assign Events
              to this Team. Please ensure that all information is accurate to the best of your abilities. You can edit
              the Team from the Teams page after its creation.
              <br />
              It is not possible to change the group value of a pre-exisitng Team. If you change the name of the Team,
              the name of the Group will also change.
              <br />
              You must assign a Team Leader. You can do this by providing the username of the Team Leader in the form.
              This will appear on their Profile in the Team section.
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
        options: { replaceTargetUrl: image.url },
      });

      return res.url;
    }

    return undefined;
  };

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    const changedName = values.name !== team.name;

    if (preexistingTeams?.map(t => t.name).includes(values.name) && changedName) {
      toast({
        title: "Error editing Team",
        description: "You must provide a unique Team name."
      });

      return;
    }

    let slots: number = Number.MAX_VALUE;

    if (values.hasSlotCap && values.slots) slots = parseInt(values.slots, 10);

    if (team.members.length > slots) {
      toast({
        title: "You can't have less slots than members, silly!",
        description: "Try removing a few Members, then setting a slot cap."
      });

      return;
    }

    const newImage = values.image ? await uploadFile(values.image) : team.image;

    if (values.image) {
      await edgestore.publicFiles.delete({
        url: team.image || ""
      }).then(async() => {
        await removeImage({ id: team.teamId });
      }, () => {
        toast({
          title: "There was an issue confirming your edits.",
          description: "Refresh the page and try again."
        });
      });
    }

    await update({
      teamId: team.teamId,
      name: values.name,
      image: newImage,
      description: values.description,
      location: values.location,
      lead: values.lead,
      groupValue: team.groupValue,
      link: values.link,
      slots
    });

    modal.onClose();
    image.onClose();

    toast({
      title: "Successfully edited this Team",
      description: "It may take some time for these edits to appear across Golden Years"
    });
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogTitle className="border-b pb-3">
          <div className="text-lg font-medium">
            Edit Team information
          </div>
        </DialogTitle>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
              Use this modal to edit information about this Team. Your edits will be publicly available on this Team.
            <br />
              This Team will be joinable by all members of Golden Years. It will become possible to assign Events
              to this Team. Please ensure that all information is accurate to the best of your abilities. You can edit
              the Team from the Teams page after its creation.
            <br />
              It is not possible to change the group value of a pre-exisitng Team. If you change the name of the Team,
              the name of the Group will also change.
            <br />
              You must assign a Team Leader. You can do this by providing the username of the Team Leader in the form.
              This will appear on their Profile in the Team section.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          <TeamEditForm onSubmit={onSubmit} team={team} />
        </div>
      </DialogContent>
    </Dialog>
  );
};