"use client";

import { useQuery } from "convex/react";

import Spinner from "@/components/Spinner";

import { api } from "@/convex/_generated/api";

import { columns } from "./Columns";
import { DataTable } from "./DataTable";

export const UserStatisticsTable = () => {
  const data = useQuery(api.users.getUserStatistics);

  if (!data) return <Spinner />;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data?.statistics || []} />
    </div>
  );
};