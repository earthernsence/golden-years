"use client";

import { useEffect, useState } from "react";

import { ArticleCoverImageModal } from "../modals/ArticleCoverImageModal";
import { AssignGroupModal } from "../modals/AssignGroupModal";
import { AssignRoleModal } from "../modals/AssignRoleModal";
import { CreateEventModal } from "../modals/CreateEventModal";
import { CreateGroupModal } from "../modals/CreateGroupModal";
import { EditEventModal } from "../modals/EditEventModal";
import { EditEventParticipantsModal } from "../modals/EditEventParticipantsModal";
import { LeaveEventModal } from "../modals/LeaveEventModal";
import { PrivacyPolicyModal } from "../modals/PrivacyPolicy";
import { SignUpModal } from "../modals/SignUpModal";
import { TeamCreateModal } from "../modals/TeamCreateModal";
import { TeamEditModal } from "../modals/TeamEditModal";
import { TeamInfoModal } from "../modals/TeamInfoModal";
import { TeamJoinModal } from "../modals/TeamJoinModal";
import { TeamLeaveModal } from "../modals/TeamLeaveModal";
import { TeamMembersModal } from "../modals/TeamMembersModal";
import { TermsModal } from "../modals/Terms";
import { UploadProfilePictureModal } from "../modals/UploadProfilePictureModal";

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
      <TeamInfoModal />
      <TeamMembersModal />
      <TeamJoinModal />
      <TeamLeaveModal />
      <TeamCreateModal />
      <TeamEditModal />
      <UploadProfilePictureModal />
      <EditEventParticipantsModal />
      <ArticleCoverImageModal />
    </>
  );
};