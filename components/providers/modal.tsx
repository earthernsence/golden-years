"use client";

import { useEffect, useState } from "react";

import { AssignGroupModal } from "../modals/AssignGroupModal";
import { AssignRoleModal } from "../modals/AssignRoleModal";
import { CreateEventModal } from "../modals/CreateEventModal";
import { CreateGroupModal } from "../modals/CreateGroupModal";
import { EditEventModal } from "../modals/EditEventModal";
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
      <EditEventModal />
      <LeaveEventModal />
      <AssignRoleModal />
      <CreateGroupModal />
      <AssignGroupModal />
    </>
  );
};