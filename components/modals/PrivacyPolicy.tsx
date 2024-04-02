"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";
import { usePrivacyPolicyModal } from "@/hooks/use-privacy-policy-modal";

export const PrivacyPolicyModal = () => {
  const privacy = usePrivacyPolicyModal();

  return (
    <Dialog open={privacy.isOpen} onOpenChange={privacy.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
          Privacy Policy
          </div>
        </DialogHeader>
        <DialogDescription>
          <div className="flex items-center text-sm">
          App name is a simple, interactive way of scheduling events and getting the help for your events.
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};