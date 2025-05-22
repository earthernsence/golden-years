"use client";

import { Doc } from "@/convex/_generated/dataModel";

import { SingleTeamButtonsSection } from "./SingleTeamButtonsSection";
import { SingleTeamInfoSection } from "./SingleTeamInfoSection";

interface SingleTeamProps {
  team: Doc<"teams">
}

export const SingleTeam = ({
  team
}: SingleTeamProps) => (
  <div className="flex flex-col justify-start m-1 p-2 w-[calc(50%-2rem)] min-w-88
                    bg-gray-300 dark:bg-gray-600 border-4 border-gray-700 border-solid rounded-2xl"
  >
    <SingleTeamInfoSection team={team} />
    <br />
    <br />
    <SingleTeamButtonsSection team={team} />
    <br />
  </div>
);