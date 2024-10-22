"use client";

import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from "@/components/ui/Dialog";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { useTeamJoinModal } from "@/hooks/use-team-join-modal";

export const TeamJoinModal = () => {
  const joinModal = useTeamJoinModal();
  const { isSignedIn, userId } = useAuth();
  const { toast } = useToast();

  const user = useQuery(api.users.getUserById, { id: `${userId}` });

  const join = useMutation(api.teams.join);

  if (!joinModal.team) {
    return (
      <Dialog open={joinModal.isOpen} onOpenChange={joinModal.onClose}>
        <DialogContent className="h-full max-h-[50%] overflow-y-auto">
          <DialogTitle className="border-b pb-3">
            <div className="text-lg font-medium">
              Join this Team
            </div>
          </DialogTitle>
          <DialogDescription className="space-y-1">
            <div className="flex items-center text-xs">
              Your information will appear on the Members modal, and other users
              will be able to visit your account.
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
    if (!joinModal.team) return;

    if (!isSignedIn) {
      toast({
        title: "Cannot join this Team",
        description: "You must be signed in in order to join a Team"
      });

      return;
    }

    if (!joinModal.team._id) {
      toast({
        title: "There was an error when joining this Team.",
        description: "Refresh the page and try again."
      });

      return;
    }

    toast({
      title: `Successfully joined the ${joinModal.team.name} Team`,
      description: `This Team now appears on your User Profile. You can leave at any time
      from the Teams page.`
    });

    await join({
      id: joinModal.team._id,
      user: user.userId
    });

    joinModal.onClose();
  };

  return (
    <Dialog open={joinModal.isOpen} onOpenChange={joinModal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogTitle className="border-b pb-3">
          <div className="text-lg font-medium">
            Join this Team
          </div>
        </DialogTitle>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            Your information will appear on the Members modal, and other users
            will be able to visit your account.
          </div>
        </DialogDescription>
        <div className="text-sm text-justify w-full">
          Are you sure you wish to join the {joinModal.team.name} Team?
          You can leave at any time from the Teams page.
        </div>
        <DialogFooter className="flex flex-row justify-end gap-x-2">
          <Button type="button" onClick={() => joinModal.onClose()}>Cancel</Button>
          <Button type="button" onClick={confirmJoin}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};