"use client";

import { BarChart3, Calendar, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useCreateEventModal } from "@/hooks/use-create-event-modal";

import { Button } from "@/components/ui/Button";

interface EventsPageHeaderProps {
  page: "events" | "statistics",
  setPage: Dispatch<SetStateAction<"events" | "statistics">>,
}

export const EventsPageHeader = ({ page, setPage }: EventsPageHeaderProps) => {
  const createModal = useCreateEventModal();

  const { userId } = useAuth();
  const user = useQuery(api.users.getUserById, { id: `${userId}` });
  const isAdmin = user?.admin || false;

  return (
    <div className="flex xs:flex-col md:flex-row md:justify-between xs:items-center pb-4">
      <div className="text-4xl xs:pb-2 md:pb-0 xs:text-center md:text-left">
        Events
      </div>
      { isAdmin && (
        <div className="flex flex-row gap-x-2">
          <Button
            size="sm"
            onClick={() => setPage(page === "statistics" ? "events" : "statistics")}
            className="xs:max-w-auto md:max-w-full"
          >
            {page === "statistics"
              ? (
                <>
                  <Calendar className="mr-2 h-4 w-4" /> Events
                </>
              )
              : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" /> Statistics
                </>
              )}
          </Button>
          <Button size="sm" onClick={createModal.onOpen} className="xs:max-w-auto md:max-w-full">
            <Plus className="mr-2 h-4 w-4" /> Create an Event
          </Button>
        </div>
      )}
    </div>
  );
};