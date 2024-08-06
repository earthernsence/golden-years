"use client";

import { useMutation, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { useToast } from "@/components/ui/use-toast";

import { EditProfileForm, formSchema } from "./EditProfileForm";
import { Sidebar } from "./card/Sidebar";
import { UserInformation } from "./card/UserInformation";

interface UserCardProps {
  user: Doc<"users">,
  isUser: boolean,
}

export const UserCard = ({ user, isUser }: UserCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { userId } = useAuth();

  const update = useMutation(api.users.update);
  const visitor = useQuery(api.users.getUserById, { id: `${userId}` });

  const isVisitorAdmin = visitor?.admin || false;

  const userTeam = user.team || "";
  const team = useQuery(api.teams.getTeamFromId, { id: userTeam });

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
    <div className="flex p-4 gap-x-8 bg-muted-foreground/10 rounded-md border
                    xs:flex-col md:flex-row xs:w-full md:w-auto md:max-w-[50%] h-auto
                  dark:border-white"
    >
      <Sidebar
        user={user}
        isEditing={isEditing}
        isUser={isUser}
        isVisitorAdmin={isVisitorAdmin}
        setIsEditing={setIsEditing}
      />
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
      <Sidebar
        user={user}
        isEditing={isEditing}
        isUser={isUser}
        isVisitorAdmin={isVisitorAdmin}
        setIsEditing={setIsEditing}
      />
      <UserInformation
        user={user}
        isUser={isUser}
        team={team || undefined}
        isVisitorAdmin={isVisitorAdmin}
      />
    </div>
  );
};

UserCard.Skeleton = function UserCardSkeleton() {
  return (
    <div className="flex p-4 gap-x-2 bg-muted-foreground/10 rounded-md border
                    xs:flex-col md:flex-row xs:w-full md:w-auto h-auto
                  dark:border-white"
    >
      <Sidebar.Skeleton />
      <UserInformation.Skeleton />
    </div>
  );
};