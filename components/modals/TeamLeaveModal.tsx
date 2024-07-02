"use client";

import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from "@/components/ui/Dialog";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { useTeamLeaveModal } from "@/hooks/use-team-leave-modal";

export const TeamLeaveModal = () => {
  const leaveModal = useTeamLeaveModal();
  const { isSignedIn, userId } = useAuth();
  const { toast } = useToast();

  const user = useQuery(api.users.getUserById, { id: `${userId}` });

  const leave = useMutation(api.teams.leave);

  if (!leaveModal.team) {
    return (
      <Dialog open={leaveModal.isOpen} onOpenChange={leaveModal.onClose}>
        <DialogContent className="h-full max-h-[50%] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="text-lg font-medium">
              Leave this Team
            </div>
          </DialogHeader>
          <DialogDescription className="space-y-1">
            <div className="flex items-center text-xs">
              You will be removed from this Team. You will be able to rejoin any other team
              from the Teams page. You will also be removed from any future Team-exclusive events
              you may have joined while on this Team.
            </div>
          </DialogDescription>
          <div className="text-lg text-justify w-full">
            Team not found.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const confirmJoin = async() => {
    if (!user) return;
    if (!leaveModal.team) return;

    if (!isSignedIn) {
      toast({
        title: "Cannot leave this Team",
        description: "You must be signed in in order to leave a Team"
      });

      return;
    }

    if (!leaveModal.team._id) {
      toast({
        title: "There was an error when leaving this Team.",
        description: "Refresh the page and try again."
      });

      return;
    }

    toast({
      title: `Successfully left the ${leaveModal.team.name} Team`,
      description: `You are no longer a Member of this Team. You can rejoin any team from the Teams page.`
    });

    await leave({
      id: leaveModal.team._id,
      user: user.userId
    });

    leaveModal.onClose();
  };

  return (
    <Dialog open={leaveModal.isOpen} onOpenChange={leaveModal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Leave this Team
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            You will be removed from this Team. You will be able to rejoin any other team
            from the Teams page.
          </div>
        </DialogDescription>
        <div className="text-sm text-justify w-full">
          Are you sure you wish to leave the {leaveModal.team.name} Team?
        </div>
        <DialogFooter className="flex flex-row justify-end gap-x-2">
          <Button type="button" onClick={() => leaveModal.onClose()}>Cancel</Button>
          <Button type="button" onClick={confirmJoin}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};