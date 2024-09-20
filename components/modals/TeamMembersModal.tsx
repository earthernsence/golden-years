"use client";

import { useMutation, useQuery } from "convex/react";
import { Mail } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Spinner from "../Spinner";
import { toast } from "@/components/ui/use-toast";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useTeamMembersModal } from "@/hooks/use-team-members-modal";

import { TeamMembers } from "./TeamMember";

import { quantify } from "@/lib/utils";

export const TeamMembersModal = () => {
  const modal = useTeamMembersModal();

  const { userId } = useAuth();
  const visitor = useQuery(api.users.getUserById, { id: `${userId}` });
  const memberEmails = useQuery(api.teams.memberEmails, { teamId: `${modal.team?.teamId}` });

  const leave = useMutation(api.teams.leave);

  const isTeamLead = visitor?.userId === modal.team?.lead;
  const isVisitorAdmin = visitor?.admin || false;

  const canEditMembers = isTeamLead || isVisitorAdmin;

  const team = useQuery(api.teams.getTeamFromId, { id: `${modal.team?.teamId}` });

  if (!team) return <Spinner />;

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

  const remove = async(user: Doc<"users">) => {
    if (!user) return;
    if (!modal.team) return;

    if (!modal.team._id) {
      toast({
        title: "There was an error when removing this User from this Team.",
        description: "Refresh the page and try again."
      });

      return;
    }

    toast({
      title: `Successfully removed ${user.username} (${user.name}) from ${modal.team.name} Team`,
      description: "You can continue removing Members."
    });

    await leave({
      id: modal.team._id,
      user: user.userId
    });
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
          Use this modal to view the members of this Team.{" "}
          {team.slots < Number.MAX_VALUE ? (
            <span className="font-semibold">
              This team has a Member cap of {quantify("Member", team.slots, 0)}.
            </span>
          ) : (
            <span>
              This team does not have a Member cap.
            </span>
          )}
        </DialogDescription>
        <div className="flex flex-col text-md gap-y-2">
          <TeamMembers
            members={team.members}
            remove={remove}
            canEditMembers={canEditMembers}
          />
          {canEditMembers && team.members.length >= 1 && (
            <Button variant={"default"} onClick={copyContent}>
              <Mail className="mr-2 size-4" />
              Copy Email Addresses
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};