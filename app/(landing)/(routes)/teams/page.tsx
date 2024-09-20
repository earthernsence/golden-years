"use client";

import { Info, Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { Button } from "@/components/ui/Button";
import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { SingleTeam } from "./_components/SingleTeam";
import { useTeamCreateModal } from "@/hooks/use-team-create-modal";
import { useTeamInfoModal } from "@/hooks/use-team-info-modal";

const TeamsPage = () => {
  const createModal = useTeamCreateModal();
  const { userId } = useAuth();
  const visitor = useQuery(api.users.getUserById, { id: `${userId}` });

  const isVisitorAdmin = visitor?.admin || false;

  const teams = useQuery(api.teams.get);

  const infoModal = useTeamInfoModal();

  if (teams === null) return <Spinner />;

  return (
    <div className="place-self-center w-full max-w-7xl pt-0 pb-12 px-12 text-left flex flex-col">
      <div className="flex xs:flex-col md:flex-row md:justify-between items-center pb-4">
        <div className="text-4xl xs:text-center md:text-left pb-2">
          Teams
        </div>
        {isVisitorAdmin && (
          <Button size="sm" onClick={createModal.onOpen} className="xs:max-w-auto md:max-w-full">
            <Plus className="mr-2 size-4" /> Create a Team
          </Button>
        )}
      </div>
      <div
        className="inline-flex flex-row items-center xs:justify-center md:justify-normal
                  text-sm xs:text-center md:text-left opacity-50"
        onClick={infoModal.onOpen}
      >
        <Info role="button" className="mr-2 size-4" /> Click for info
      </div>
      <br />
      <div className="flex flex-row flex-wrap w-full xs:justify-center md:justify-evenly xs:gap-y-4 md:gap-y-0">
        {teams && teams.map(
          (team: Doc<"teams">, index: number) => <SingleTeam team={team} key={index} />
        )}
      </div>
    </div>
  );
};

export default TeamsPage;