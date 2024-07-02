"use client";

import { Mail } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { useTeamMembersModal } from "@/hooks/use-team-members-modal";

import { TeamMember } from "./TeamMember";

export const TeamMembersModal = () => {
  const modal = useTeamMembersModal();

  const { userId } = useAuth();
  const visitor = useQuery(api.users.getUserById, { id: `${userId}` });
  const memberEmails = useQuery(api.teams.memberEmails, { teamId: `${modal.team?.teamId}` });

  const isTeamLead = visitor?.userId === modal.team?.lead;
  const isVisitorAdmin = visitor?.admin || false;

  const canCopyEmails = isTeamLead || isVisitorAdmin;

  if (modal.team?.members === undefined || modal.team.members.length === 0) {
    return (
      <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
        <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="text-lg font-medium">
              Team Members
            </div>
          </DialogHeader>
          <DialogDescription className="space-y-1">
            Use this modal to view the members of this Team. Teams do not have a member cap.
          </DialogDescription>
          <div className="text-lg text-justify w-full">
            No members on this Team...be the first!
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const copyContent = async() => {
    try {
      if (!memberEmails) {
        toast({
          title: "The emails could not be copied",
          description: "Refresh the page and try again"
        });
        return;
      }

      await navigator.clipboard.writeText(memberEmails.join(", "));
      toast({
        title: "Succesfully copied member emails to clipboard"
      });
    } catch (err) {
      toast({
        title: "Emails could not be copied to clipboard",
        description: `Refresh the page and try again. ${err}`
      });
    }
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Team Members
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
            Use this modal to view the members of this Team. Teams do not have a member cap.
        </DialogDescription>
        <div className="flex flex-col text-md gap-y-2">
          {
            modal.team.members.map((member: string, index: number) => (
              <TeamMember member={member} key={index} />
            ))
          }
          {canCopyEmails && modal.team.members.length >= 1 && (
            <Button variant={"default"} onClick={copyContent}>
              <Mail className="mr-2 w-4 h-4" />
              Copy Email Addresses
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};