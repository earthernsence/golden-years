"use client";

import { useMutation, useQuery } from "convex/react";
import { z } from "zod";

import { api } from "@/convex/_generated/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/use-toast";

import { AssignGroupForm, formSchema } from "./AssignGroupForm";

import { useAssignGroupModal } from "@/hooks/use-assign-group-modal";

export const AssignGroupModal = () => {
  const { toast } = useToast();
  const modal = useAssignGroupModal();

  const updateGroups = useMutation(api.users.updateGroups);
  const allGroups = useQuery(api.groups.get, { type: "all" });

  const user = useQuery(api.users.getUserById, { id: `${modal.user?.userId}` });

  if (!allGroups || !modal.user || !user) return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogTitle className="border-b pb-3">
          <div className="text-lg font-medium">
            Assign groups to user
          </div>
        </DialogTitle>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs text-justify">
            Use this modal to force-assign groups to specific users. This is useful for things like
            &quot;fixed&quot; groups, or groups that cannot be chosen by a user from their profile. You
            can create groups using the Create Group modal by clicking the plus symbol.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          Could not retrieve groups.
        </div>
      </DialogContent>
    </Dialog>
  );

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    if (!modal.user || !user) {
      toast({
        title: "Could not assign groups.",
        description: "This user does not exist."
      });

      return;
    }

    toast({
      title: "Your edits have been saved!",
      description: "It may take time for these edits to show across Golden Years."
    });

    await updateGroups({
      userId: user._id,
      groups: values.groups.map(group => group.value)
    });

    modal.onClose();
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogTitle className="border-b pb-3">
          <div className="text-lg font-medium">
            Assign groups to user
          </div>
        </DialogTitle>
        <DialogDescription className="space-y-1">
          <div className="items-center text-xs text-justify inline-flex flex-row">
            Use this modal to force-assign groups to specific users. This is useful for things like
            &quot;fixed&quot; groups, or groups that cannot be chosen by a user from their profile. You
            can create groups using the Create Group modal by clicking the plus symbol.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          <AssignGroupForm onSubmit={onSubmit} user={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
};