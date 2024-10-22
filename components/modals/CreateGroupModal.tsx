"use client";

import { useMutation, useQuery } from "convex/react";
import { z } from "zod";

import { api } from "@/convex/_generated/api";

import { CreateGroupForm, formSchema } from "./CreateGroupForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/use-toast";

import { useCreateGroupModal } from "@/hooks/use-create-group-modal";

export const CreateGroupModal = () => {
  const { toast } = useToast();
  const modal = useCreateGroupModal();

  const create = useMutation(api.groups.create);
  const allGroups = useQuery(api.groups.get, { type: "all" });

  if (!allGroups) return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogTitle className="border-b pb-3">
          <div className="text-lg font-medium">
            Create a group
          </div>
        </DialogTitle>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs text-justify">
            Use this modal to create different groups that can appear on profiles. These groups will be
            able to be joined at any time on the website in the edit profile menu, unless the group is a
            &quot;fixed&quot; group. You can find more explanation below of what each field means.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          Could not retrieve groups.
        </div>
      </DialogContent>
    </Dialog>
  );

  const groupValues = allGroups.map(group => group.value);
  const groupLabels = allGroups.map(group => group.label);

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    if (groupValues.includes(values.value)) {
      toast({
        title: "This group value is taken!",
        description: `Groups must have unique value identifiers. The identifier ${values.value} already exists.`
      });

      return;
    }

    if (groupLabels.includes(values.label)) {
      toast({
        title: "This group label is taken!",
        description: `Groups must have unique label identifiers. The identifier ${values.label} already exists.`
      });

      return;
    }

    await create({
      ...values
    });

    toast({
      title: `Successfully created group ${values.label}`,
      description: `Users can now join it if it is not a "fixed" group.`
    });

    modal.onClose();
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogTitle className="border-b pb-3">
          <div className="text-lg font-medium">
            Create a group
          </div>
        </DialogTitle>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs text-justify">
            Use this modal to create different groups that can appear on profiles. These groups will be
            able to be joined at any time on the website in the edit profile menu, unless the group is a
            &quot;fixed&quot; group. You can find more explanation below of what each field means.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          <CreateGroupForm onSubmit={onSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};