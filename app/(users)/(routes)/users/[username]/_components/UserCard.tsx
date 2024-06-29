"use client";

import { Cog, Pencil, PlusCircle, Star } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { useAssignGroupModal } from "@/hooks/use-assign-group-modal";
import { useAssignRoleModal } from "@/hooks/use-assign-role-modal";
import { useCreateGroupModal } from "@/hooks/use-create-group-modal";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/use-toast";

import { EditProfileForm, formSchema } from "./EditProfileForm";
import { GroupsList } from "./GroupsList";
import { PastEvents } from "./PastEvents";
import { TimeSpan } from "./formatter/TimeSpan";


interface UserCardProps {
  user: Doc<"users">,
  isUser: boolean,
}

export const UserCard = ({ user, isUser }: UserCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { userId } = useAuth();
  const adminModal = useAssignRoleModal();
  const createGroupModal = useCreateGroupModal();
  const assignGroupModal = useAssignGroupModal();

  const update = useMutation(api.users.update);
  const visitor = useQuery(api.users.getUserById, { id: `${userId}` });

  const isVisitorAdmin = visitor?.admin || false;

  const confirmEdits = async(values: z.infer<typeof formSchema>) => {
    toast({
      title: "Your edits have been saved!",
      description: "It may take time for these edits to show across Golden Years."
    });

    const { groups, ...rest } = values;

    await update({
      userId: user._id,
      groups: groups.map(group => group.value),
      ...rest
    });

    setIsEditing(false);
  };

  if (isEditing) return (
    <div className="flex p-4 xs:gap-y-2 md:gap-y-0 md:gap-x-8 bg-muted-foreground/10 rounded-md border
                    xs:flex-col md:flex-row xs:w-full md:w-auto h-auto
                  dark:border-white"
    >
      <div className="flex xs:flex-row md:flex-col xs:w-full md:w-1/4 md:min-w-[144px] items-center justify-center">
        <div className="flex xs:flex-row md:flex-col items-center xs:gap-x-2 md:gap-y-2 w-full xs:justify-between">
          <Image
            src={user.image || "/no_image.png"}
            alt="User image"
            className="xs:w-24 md:w-36 xs:h-24 md:h-36 rounded-full border dark:border-gray-500"
            width={1024}
            height={1024}
          />
          <div className="flex flex-col justify-center">
            <div className={cn(
              "font-bold inline-flex flex-row justify-center items-center gap-x-1 min-h-6",
              user.admin && "text-red-500"
            )}>
              {user.exec && (<Star className="w-4 h-4" />)} {user.name}
            </div>
            <div className="flex text-sm opacity-75 min-h-6 justify-center items-center">
              {user.exec ?? "Member"}
            </div>
            <div className="flex text-xs opacity-50 min-h-6 justify-center items-center">{user.username}</div>
          </div>
          {isUser && (
            <div className="flex md:flex-col justify-center">
              <Button variant={"outline"} onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center place-self-center">
        <EditProfileForm onSubmit={confirmEdits} user={user} />
      </div>
    </div>
  );

  return (
    <div className="flex p-4 gap-x-8 bg-muted-foreground/10 rounded-md border
                    xs:flex-col md:flex-row xs:w-full md:w-auto md:max-w-[50%] h-auto
                  dark:border-white"
    >
      <div className="flex xs:flex-row md:flex-col xs:w-full md:w-1/4 md:min-w-[144px] items-center justify-center">
        <div className="flex xs:flex-row md:flex-col items-center xs:gap-x-1 md:gap-y-2 w-full xs:justify-between">
          <Image
            src={user.image || "/no_image.png"}
            alt="User image"
            className="xs:w-24 md:w-36 xs:h-24 md:h-36 rounded-full border dark:border-gray-500"
            width={1024}
            height={1024}
          />
          <div className="flex flex-col justify-center">
            <div className={cn(
              "font-bold inline-flex flex-row justify-center items-center gap-x-1 min-h-6",
              user.admin && "text-red-500"
            )}>
              {user.exec && (<Star className="w-4 h-4" />)} {user.name}
            </div>
            <div className="flex text-sm opacity-75 min-h-6 justify-center items-center">
              {user.exec || "Member"}
            </div>
            <div className="flex text-xs opacity-50 min-h-6 justify-center items-center">{user.username}</div>
          </div>
          <div className="flex flex-col gap-y-2">
            {isUser && (
              <div className="flex justify-center">
                <Button variant={"outline"} onClick={() => setIsEditing(true)}>
                  <Pencil className="md:mr-2 h-4 w-4" /> <span className="xs:hidden md:block">Edit</span>
                </Button>
              </div>
            )}
            {isVisitorAdmin && (
              <div className="flex justify-center">
                <Button variant={"outline"} onClick={() => adminModal.onOpen(user)}>
                  <Cog className="md:mr-2 h-4 w-4" /> <span className="xs:hidden md:block">Admin</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col xs:w-full md:w-3/4 gap-y-2">
        <div className="min-h-1/6 h-auto text-left text-sm">
          <div className="text-lg font-semibold">Account age</div>
            This account was created {new TimeSpan(Date.now() - user.signupTime).toStringNoDecimals()} ago
        </div>
        <br />
        <div className="min-h-1/6 h-auto text-left text-sm">
          <div className="text-lg font-semibold">Biography</div>
          {user.bio ?? "None provided..."}
        </div>
        <br />
        <div className="min-h-1/6 h-auto text-left text-sm">
          <div className="text-lg font-semibold">Location</div>
          {user.location ?? "None provided..."}
        </div>
        <br />
        <div className="min-h-1/6 h-auto text-left text-sm">
          <div className="text-lg font-semibold flex flex-row items-center">
            Groups
            {isVisitorAdmin && (
              <PlusCircle
                className="h-4 w-4 ml-2"
                role="button"
                onClick={createGroupModal.onOpen}
              />
            )}
            {isVisitorAdmin && (
              <Pencil
                className="h-4 w-4 ml-2"
                role="button"
                onClick={() => assignGroupModal.onOpen(user)}
              />
            )}
          </div>
          <GroupsList groups={user.groups} />
        </div>
        <br />
        <div className="h-1/3 text-left text-sm">
          <div className="text-lg font-semibold">Past events</div>
          <PastEvents events={user.events} />
        </div>
      </div>
    </div>
  );
};

UserCard.Skeleton = function UserCardSkeleton() {
  return (
    <div className="flex p-4 gap-x-2 bg-muted-foreground/10 rounded-md border
                    xs:flex-col md:flex-row xs:w-full md:w-auto h-auto
                  dark:border-white"
    >
      <div className="flex xs:flex-row md:flex-col xs:w-full md:w-1/4 items-center justify-center">
        <div className="flex xs:flex-row md:flex-col items-center xs:gap-x-2 md:gap-y-2">
          <Skeleton className="xs:w-24 md:w-36 xs:h-24 md:h-36 rounded-full" />
          <div className="flex flex-col gap-y-2">
            <Skeleton className="w-16 h-6 rounded-sm" />
            <Skeleton className="w-14 h-4 rounded-sm" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-3/4 gap-y-2">
        <div className="flex flex-col h-1/6 text-left gap-y-1">
          <Skeleton className="w-36 h-[28px] rounded-sm" />
          <Skeleton className="xs:w-36 md:w-96 h-4 rounded-sm" />
          <Skeleton className="xs:w-36 md:w-96 h-4 rounded-sm" />
        </div>
        <div className="flex flex-col h-1/6 text-left gap-y-1">
          <Skeleton className="w-40 h-[28px] rounded-sm" />
          <Skeleton className="w-72 h-4 rounded-sm" />
        </div>
        <div className="flex flex-col h-1/6 text-left gap-y-1">
          <Skeleton className="w-24 h-[28px] rounded-sm" />
          <Skeleton className="w-48 h-4 rounded-sm" />
        </div>
        <div className="flex flex-col h-1/6 text-left gap-y-1">
          <Skeleton className="w-16 h-[28px] rounded-sm" />
          <Skeleton className="w-56 h-4 rounded-sm" />
        </div>
        <div className="flex flex-col h-1/3 text-left gap-y-1">
          <Skeleton className="w-24 h-[28px] rounded-sm" />
          <Skeleton className="w-32 h-4 rounded-sm" />
        </div>
      </div>
    </div>
  );
};