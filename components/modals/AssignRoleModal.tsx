"use client";

import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/Dialog";

import { api } from "@/convex/_generated/api";
import { useAssignRoleModal } from "@/hooks/use-assign-role-modal";

import { useToast } from "@/components/ui/use-toast";

import { AssignRoleForm, formSchema } from "./AssignRoleForm";

import { ElementType } from "@/lib/utils";

const ROLES = [
  "President",
  "Co-President",
  "Vice President",
  "Fundraising Specialist",
  "Social Media Specialist",
  "Secretary",
  "Vice Secretary",
  "Website Developer",
  "None"
] as const;

type Role = ElementType<typeof ROLES>;

export const AssignRoleModal = () => {
  const assign = useAssignRoleModal();
  const { toast } = useToast();

  const { userId } = useAuth();

  const update = useMutation(api.users.updateRole);
  const user = useQuery(api.users.getUserById, { id: `${userId}` });

  if (!assign.user) {
    return (
      <Dialog open={assign.isOpen} onOpenChange={assign.onClose}>
        <DialogContent className="h-full max-h-[50%] overflow-y-auto">
          <DialogTitle className="border-b pb-3">
            <div className="text-lg font-medium">
              Assign a role
            </div>
          </DialogTitle>
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
    if (!user) {
      toast({
        title: "Issue assigning role to user",
        description: "Please refresh the page and try again."
      });

      return;
    }

    if (!assign.user) {
      toast({
        title: "Could not assign role",
        description: "This user does not exist"
      });

      return;
    }

    // Prevent admins from removing their own admin status. Others will still be able to, but not themselves.
    const isUser = assign.user.userId === user.userId;
    const admin = isUser ? true : values.isAdmin;

    await update({
      userId: assign.user.userId,
      exec: values.role,
      admin
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
        <DialogTitle className="border-b pb-3">
          <div className="text-lg font-medium">
            Assign a role
          </div>
        </DialogTitle>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            Use this admin panel to assign members a role. Assigning &quot;None&quot; will remove the
            &quot;Executive Team 24-25&quot; group, and assigning any role will add it to the user.
          </div>
        </DialogDescription>
        <div className="flex flex-col justify-center items-center align-middle">
          <AssignRoleForm
            onSubmit={onSubmit}
            isAdmin={assign.user.admin}
            role={assign.user.exec as Role ?? "None"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};