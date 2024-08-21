"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Id } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";

export type TrackedUser = {
  _id: Id<"users">,
  name: string,
  username: string,
  events: number,
  hours: number
}

export const columns: ColumnDef<TrackedUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "hours",
    header: ({ column }) => {
      const sortingDirection = () => {
        switch (column.getIsSorted()) {
          case "asc":
            return <ArrowUp className="ml-2 size-4" />;
          case "desc":
            return <ArrowDown className="ml-2 size-4" />;
          case false:
            return <ArrowUpDown className="ml-2 size-4" />;
          default:
            throw new Error(`Unknown sorting direction: ${column.getIsSorted()}`);
        }
      };

      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting()}
        >
          Hours {sortingDirection()}
        </Button>
      );
    },
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 2
      }).format(row.getValue("hours"));

      return <div className="font-medium">{formatted}</div>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link
              href={`/users/${user.username}`}
              target={"_blank"}
            >
              <DropdownMenuItem
                role="button"
                className="hover:cursor-pointer"
              >
                Visit profile
              </DropdownMenuItem>
            </Link>
            <div
              onClick={() => navigator.clipboard.writeText(user.username)}
            >
              <DropdownMenuItem
                role="button"
                className="hover:cursor-pointer"
              >
                Copy username
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];