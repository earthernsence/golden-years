"use client";

import { useMutation } from "convex/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";

import { useAssignRoleModal } from "@/hooks/use-assign-role-modal";

import { useToast } from "@/components/ui/use-toast";

import { AssignRoleForm, formSchema } from "./AssignRoleForm";
import { api } from "@/convex/_generated/api";
import { z } from "zod";

export const AssignRoleModal = () => {
  const assign = useAssignRoleModal();
  const { toast } = useToast();

  const update = useMutation(api.users.updateRole);

  if (!assign.user) {
    return (
      <Dialog open={assign.isOpen} onOpenChange={assign.onClose}>
        <DialogContent className="h-full max-h-[50%] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="text-lg font-medium">
              Assign a role
            </div>
          </DialogHeader>
          <DialogDescription className="space-y-1">
            <div className="flex items-center text-xs">
              Use this admin panel to assign members a role. Assigning &quot;None&quot; will remove the
              &quot;Executive Team 24-25&quot; group, and assigning any role will add it to the user.
            </div>
          </DialogDescription>
          <div className="text-lg text-justify w-full">
            User not found.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    if (!assign.user) {
      toast({
        title: "Could not assign role",
        description: "This user does not exist"
      });

      return;
    }

    await update({
      userId: assign.user.userId,
      exec: values.role
    });

    toast({
      title: "Successfully changed role",
      description: `${assign.user.name} is now a "${values.role}"`
    });

    assign.onClose();
  };

  return (
    <Dialog open={assign.isOpen} onOpenChange={assign.onClose}>
      <DialogContent className="h-full max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Assign a role
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            Use this admin panel to assign members a role. Assigning &quot;None&quot; will remove the
            &quot;Executive Team 24-25&quot; group, and assigning any role will add it to the user.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          <AssignRoleForm onSubmit={onSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};