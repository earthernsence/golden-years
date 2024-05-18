import Image from "next/image";

import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/Skeleton";

import { TimeSpan } from "./formatter/TimeSpan";

interface UserCardProps {
  user: Doc<"users">
}

export const UserCard = ({ user }: UserCardProps) => (
  <div className="flex p-4 gap-x-2 bg-muted-foreground/10 rounded-md border
                  xs:flex-col md:flex-row xs:w-full md:w-2/5 xs:h-auto md:h-2/3
                dark:border-white"
  >
    <div className="flex xs:flex-row md:flex-col xs:w-full md:w-1/4 items-center justify-center">
      <div className="flex xs:flex-row md:flex-col items-center xs:gap-x-2 md:gap-y-2">
        <Image
          src={user.image || "/no_image.png"}
          alt="User image"
          className="xs:w-24 md:w-36 xs:h-24 md:h-36 rounded-full border dark:border-gray-500"
          width={1024}
          height={1024}
        />
        <div className="flex flex-col">
          <div className={cn("font-bold", user.admin && "text-red-500")}>{user.name}</div>
          <div className="text-xs opacity-50">{user.username}</div>
        </div>
      </div>
    </div>
    <div className="flex flex-col w-3/4">
      <div className="h-1/6 text-left text-sm">
        <div className="text-lg font-semibold">Account age</div>
          This account was created {new TimeSpan(Date.now() - user.signupTime).toStringNoDecimals()} ago
      </div>
      <br />
      <div className="h-1/6 text-left text-sm">
        <div className="text-lg font-semibold">Biography</div>
        {user.bio ?? "None provided..."}
      </div>
      <br />
      <div className="h-1/6 text-left text-sm">
        <div className="text-lg font-semibold">Location</div>
        {user.location ?? "None provided..."}
      </div>
      <br />
      <div className="h-1/6 text-left text-sm">
        <div className="text-lg font-semibold">Groups</div>
        {user.groups ?? "None provided..."}
        {/* <GroupsList /> component */}
      </div>
      <br />
      <div className="h-1/3 text-left text-sm">
        <div className="text-lg font-semibold">Past events</div>
        {/* <EventsList /> component */}
      </div>
    </div>
  </div>
);

UserCard.Skeleton = function UserCardSkeleton() {
  return (
    <div className="flex p-4 bg-muted-foreground/10 rounded-md border
                    xs:flex-col md:flex-row xs:w-full md:w-2/5 xs:h-auto md:h-2/3 xs:gap-y-2 md:gap-x-2
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