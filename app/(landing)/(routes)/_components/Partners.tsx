// List of all memory care facilities we actively participate at

"use client";

import { useQuery } from "convex/react";

import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";
import Partner from "./Partner";

const Partners = () => {
  const teams = useQuery(api.teams.get);

  if (teams === null) return <Spinner />;

  const teamData = teams?.map(team => ({
    name: team.name,
    description: team.description,
    image: team.image
  }));

  return (
    <div className="flex flex-col h-full max-w-xs md:max-w-2xl justify-center">
      {teamData?.map(team => <Partner key={team.name} partner={team} />)}
    </div>
  );
};

export default Partners;