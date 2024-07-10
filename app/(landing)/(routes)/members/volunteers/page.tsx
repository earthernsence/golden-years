"use client";

import { useQuery } from "convex/react";

import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";
import { VolunteerCard } from "./_components/VolunteerCard";

interface VolunteerMemberInformation {
  name: string,
  image: string,
  username: string
}

const VolunteerMembersPage = () => {
  const users = useQuery(api.users.get);

  if (users === undefined) return <Spinner />;

  const members = users.filter(u => !u.exec) as Array<VolunteerMemberInformation>;

  const alphabetised = members.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="place-self-center max-w-7xl h-full pt-0 pb-12 pl-16 pr-16
                   dark:bg-dark xs:text-left md:text-justify"
    >
      <div className="text-4xl pb-4 xs:text-center md:text-left w-full">
        <span className="text-gy-light dark:text-gy-dark">Golden Years</span> Volunteer Team
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-4 xs:w-full">
        {alphabetised.map((volunteer, index) => <VolunteerCard volunteer={volunteer} key={index} />)}
      </div>
    </div>
  );
};

export default VolunteerMembersPage;