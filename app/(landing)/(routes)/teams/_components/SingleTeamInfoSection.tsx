"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useTeamEditModal } from "@/hooks/use-team-edit-modal";

import Spinner from "@/components/Spinner";

interface SingleTeamInfoSectionProps {
  team: Doc<"teams">,
}

export const SingleTeamInfoSection = ({
  team,
}: SingleTeamInfoSectionProps) => {
  const editModal = useTeamEditModal();

  const { userId } = useAuth();

  const visitor = useQuery(api.users.getUserById, { id: `${userId}` });
  const isVisitorAdmin = visitor?.admin || false;

  if (!visitor) return <Spinner />;

  return (
    <>
      <Image
        className="object-contain h-80 mb-4 place-self-center"
        src={team.image || "/no_image.png"}
        height={320}
        width={640}
        alt={`Team image for ${team.name}`}
      />
      <div className="font-bold text-lg inline-flex flex-row items-center">
        { team.name }
        {isVisitorAdmin && (
          <Pencil
            className="h-4 w-4 ml-2"
            role="button"
            onClick={() => editModal.onOpen(team)}
          />
        )}
      </div>
      <i>{ team.location }</i>
      <i>
        <Link
          href={team.link}
          className="underline text-sky-500 cursor-pointer"
          target="_blank"
        >
          Link to Website
        </Link>
      </i>
      <br />
      { team.description }
    </>
  );
};