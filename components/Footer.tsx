"use client";

import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";

import { usePrivacyPolicyModal } from "@/hooks/use-privacy-policy-modal";
import { useTermsModal } from "@/hooks/use-terms-modal";

export const Footer = () => {
  const terms = useTermsModal();
  const privacy = usePrivacyPolicyModal();

  return (
    <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-dark">
      <div className="font-semibold text-center w-1/12">
        <Logo />
      </div>
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={privacy.onOpen}>
        Privacy
        </Button>
        <Button variant="ghost" size="sm" onClick={terms.onOpen}>
        Terms
        </Button>
      </div>
    </div>
  );
};