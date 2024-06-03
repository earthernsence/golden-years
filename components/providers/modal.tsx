"use client";

import { useEffect, useState } from "react";

import { CreateEventModal } from "../modals/CreateEventModal";
import { LeaveEventModal } from "../modals/LeaveEventModal";
import { PrivacyPolicyModal } from "../modals/PrivacyPolicy";
import { SignUpModal } from "../modals/SignUpModal";
import { TermsModal } from "../modals/Terms";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <PrivacyPolicyModal />
      <TermsModal />
      <SignUpModal />
      <CreateEventModal />
      <LeaveEventModal />
    </>
  );
};