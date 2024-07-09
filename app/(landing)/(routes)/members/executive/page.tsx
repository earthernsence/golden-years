"use client";

import { useQuery } from "convex/react";

import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

const ExecutiveMembersPage = () => {
  const { isLoaded } = useAuth();
  const users = useQuery(api.users.get);

  if (users === undefined || !isLoaded) return <Spinner />;

  const execs = users.filter(u => u.exec);

  return (
    <div className="place-self-center max-w-7xl h-full pt-0 pb-12 pl-16 pr-16
                   dark:bg-dark xs:text-left md:text-justify"
    >
      <div className="text-4xl pb-4 xs:text-center md:text-left">Hey</div>
    </div>
  );
};

export default ExecutiveMembersPage;