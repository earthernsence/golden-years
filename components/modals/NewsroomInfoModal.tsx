"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/Dialog";

import { useNewsroomInfoModal } from "@/hooks/use-newsroom-info-modal";

export const NewsroomInfoModal = () => {
  const modal = useNewsroomInfoModal();

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.onClose}>
      <DialogContent className="h-auto max-h-[50%] overflow-y-auto">
        <DialogTitle className="border-b pb-3">
          <div className="text-lg font-medium">
            Newsroom
          </div>
        </DialogTitle>
        <div className="text-xs text-justify w-full">
          Welcome to Newsroom. The Golden Years Newsroom is a place to find various articles about the current
          state and the future of the club, as well as some general information. These are articles written by
          Admins.
          {/* <br />
          <br />
          We publish a monthly article here, known as the Gold Standard, that details our experiences
          volunteering and highlights our stellar members. */}
        </div>
      </DialogContent>
    </Dialog>
  );
};