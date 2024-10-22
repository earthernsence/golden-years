"use client";

import { Pencil, PlusCircle } from "lucide-react";

import { Doc } from "@/convex/_generated/dataModel";
import { useAssignGroupModal } from "@/hooks/use-assign-group-modal";
import { useCreateGroupModal } from "@/hooks/use-create-group-modal";

import { GroupsList } from "../GroupsList";
import { Skeleton } from "@/components/ui/Skeleton";

interface GroupsInformationProps {
  user: Doc<"users">,
  isVisitorAdmin: boolean,
  isUserLead: boolean
}

export const GroupsInformation = ({ user, isVisitorAdmin, isUserLead }: GroupsInformationProps) => {
  const createGroupModal = useCreateGroupModal();
  const assignGroupModal = useAssignGroupModal();

  return (
    <>
      <div className="text-lg font-semibold flex flex-row items-center">
            Groups
        {isVisitorAdmin && (
          <PlusCircle
            className="size-4 ml-2"
            role="button"
            onClick={createGroupModal.onOpen}
          />
        )}
        {isVisitorAdmin && (
          <Pencil
            className="size-4 ml-2"
            role="button"
            onClick={() => assignGroupModal.onOpen(user)}
          />
        )}
      </div>
      <GroupsList groups={user.groups} isUserLead={isUserLead} />
    </>
  );
};

GroupsInformation.Skeleton = function GroupsInformationSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-y-1">
        <Skeleton className="w-12 h-[28px] rounded-sm" />
        <div className="flex flex-row items-center gap-x-2">
          <Skeleton className="w-24 h-[14px] rounded-sm" />
          <Skeleton className="w-32 h-[14px] rounded-sm" />
          <Skeleton className="w-16 h-[14px] rounded-sm" />
        </div>
      </div>
    </>
  );
};