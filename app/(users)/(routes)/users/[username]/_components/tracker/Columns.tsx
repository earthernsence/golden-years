"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Id } from "@/convex/_generated/dataModel";

export type TrackedEvent = {
  _id: Id<"events">,
  title: string,
  date: number,
  hours: number
}

export const columns: ColumnDef<TrackedEvent>[] = [
  {
    accessorKey: "title",
    header: "Title"
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(date);

      return <div className="font-medium">{formatted}</div>;
    }
  },
  {
    accessorKey: "hours",
    header: "Hours"
  }
];