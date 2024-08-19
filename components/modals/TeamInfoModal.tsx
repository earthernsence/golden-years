"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/Dialog";

import { useTeamInfoModal } from "@/hooks/use-team-info-modal";

export const TeamInfoModal = () => {
  const modal = useTeamInfoModal();

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
            Teams
          </div>
        </DialogHeader>
        <div className="text-xs text-justify w-full">
          Welcome to Teams. Teams are a way of organising groups of volunteers to certain locations
          in order to create a more streamlined process for Event Organisers and the locations we serve.
          <br />
          <br />
          Members can join one team at a time. New locations will appear here if any become available.
          The Team you are on will appear under the &quot;Groups&quot; section on your User Profile, as well
          as the &quot;Team&quot; header. We encourage all Members of Golden Years to join a team, as this is
          the easiest way to ensure that you gain volunteer hours while also helping the community.
          While some teams may have a member cap, there may also be some that do not.
          <br />
          <br />
          Some Events may be exclusively available for Members of specific teams. This is to ensure that
          Team members have their most personal opportunities available to them.
          <br />
          <br />
          Teams are led by a seasoned volunteer who works closely with our Event Organisers to bring you
          the most up-to-date information about all the events Golden Years has available at a specific location.
        </div>
      </DialogContent>
    </Dialog>
  );
};