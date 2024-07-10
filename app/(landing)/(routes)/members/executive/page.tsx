"use client";

import { useQuery } from "convex/react";

import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";

import { ExecutiveCard } from "./_components/ExecutiveCard";

interface ExecutiveMemberInformation {
  name: string,
  bio: string,
  exec: string,
  image: string,
  username: string
}

// We need to generate this page in a specific order, with the higher-ranking officials on top.
const renderOrder = ["President",
  "Co-President",
  "Vice President",
  "Fundraising Specialist",
  "Secretary",
  "Vice Secretary",
  "Website Developer"
];

const ExecutiveMembersPage = () => {
  const users = useQuery(api.users.get);

  if (users === undefined) return <Spinner />;

  const execs = users.filter(u => u.exec) as Array<ExecutiveMemberInformation>;

  const inOrder: Array<[string, ExecutiveMemberInformation[]]> = [];

  for (const role of renderOrder) {
    const membersWithRole = execs.filter(e => e.exec === role);

    if (membersWithRole.length === 0) continue;

    inOrder.push([role, membersWithRole]);
  }

  return (
    <div className="place-self-center max-w-7xl h-full pt-0 pb-12 px-2
                   dark:bg-dark xs:text-left md:text-justify"
    >
      <div className="text-4xl pb-4 xs:text-center md:text-left w-full">
        <span className="text-gy-light dark:text-gy-dark">Golden Years</span> Executive Team
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-2 xs:w-full">
        {
          inOrder.map(role => (
            role[1].map((exec: ExecutiveMemberInformation, i: number) =>
              <ExecutiveCard exec={exec} key={i} />
            )
          ))
        }
      </div>
    </div>
  );
};

export default ExecutiveMembersPage;