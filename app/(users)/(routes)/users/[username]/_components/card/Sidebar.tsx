"use client";

import { Cog, Pencil, Star, X } from "lucide-react";
import Image from "next/image";
import { SetStateAction } from "react";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { useAssignRoleModal } from "@/hooks/use-assign-role-modal";
import { useUploadProfilePictureModal } from "@/hooks/use-upload-profile-picture-modal";

interface SidebarProps {
  user: Doc<"users">,
  isUser: boolean,
  isEditing: boolean,
  isVisitorAdmin: boolean,
  // eslint-disable-next-line no-unused-vars
  setIsEditing: (value: SetStateAction<boolean>) => void
}

export const Sidebar = ({ user, isEditing, isUser, isVisitorAdmin, setIsEditing }: SidebarProps) => {
  const uploadPictureModal = useUploadProfilePictureModal();
  const adminModal = useAssignRoleModal();

  const editProfilePicture = () => {
    if (!isUser) return;

    uploadPictureModal.onOpen();
  };

  return (
    <div className="flex xs:flex-row md:flex-col xs:w-full md:w-1/4 md:min-w-[144px] items-center justify-center">
      <div className="flex xs:flex-row md:flex-col items-center xs:gap-x-1 md:gap-y-2 w-full xs:justify-between">
        <div
          className="relative group"
          onClick={editProfilePicture}
          role="button"
        >
          <Image
            src={user.image || "/no_image.png"}
            alt="User image"
            className={cn(
              "xs:w-24 md:w-36 xs:h-24 md:h-36 rounded-full border dark:border-gray-500 object-cover",
              isUser && "group-hover:opacity-50 group-hover:cursor-pointer"
            )}
            width={1024}
            height={1024}
          />
          {isUser && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden
                              group-hover:block group-hover:cursor-pointer"
            >
              <Pencil className="size-12" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className={cn(
            "font-bold inline-flex flex-row justify-center items-center gap-x-1 min-h-6",
            user.admin && "text-red-500"
          )}>
            {user.exec && (<Star className="size-4" />)} {user.name}
          </div>
          <div className="flex text-sm opacity-75 min-h-6 justify-center items-center">
            {user.exec || "Member"}
          </div>
          <div className="flex text-xs opacity-50 min-h-6 justify-center items-center">{user.username}</div>
        </div>
        <div className="flex flex-col gap-y-2">
          {isUser && (
            <div className="flex justify-center">
              {isEditing
                ? (
                  <Button
                    variant={"outline"}
                    onClick={() => setIsEditing(false)}
                    className="border-black dark:border-white"
                  >
                    <X className="md:mr-2 size-4" /> <span className="xs:hidden md:block">Cancel</span>
                  </Button>
                )
                : (
                  <Button
                    variant={"outline"}
                    onClick={() => setIsEditing(true)}
                    className="border-black dark:border-white"
                  >
                    <Pencil className="md:mr-2 size-4" /> <span className="xs:hidden md:block">Edit</span>
                  </Button>
                )}
            </div>
          )}
          {isVisitorAdmin && !isEditing && (
            <div className="flex justify-center">
              <Button
                variant={"outline"}
                onClick={() => adminModal.onOpen(user)}
                className="border-black dark:border-white"
              >
                <Cog className="md:mr-2 size-4" /> <span className="xs:hidden md:block">Admin</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Sidebar.Skeleton = function SidebarSkeleton() {
  return (
    <div className="flex xs:flex-row md:flex-col xs:w-full md:w-1/4 md:min-w-[144px] items-center justify-center">
      <div className="flex xs:flex-row md:flex-col items-center xs:gap-x-1 md:gap-y-2 w-full xs:justify-between">
        <div className="relative group">
          <Skeleton className="xs:w-24 md:w-36 xs:h-24 md:h-36 rounded-full border dark:border-gray-500" />
        </div>
        <div className="flex flex-col justify-center gap-y-2">
          <Skeleton className="w-32 h-6 min-h-6" />
          <Skeleton className="w-24 h-6 opacity-75 min-h-6" />
          <Skeleton className="w-16 h-6 opacity-50 min-h-6" />
        </div>
      </div>
    </div>
  );
};