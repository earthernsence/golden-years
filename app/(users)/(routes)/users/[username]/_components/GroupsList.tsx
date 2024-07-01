"use client";

import { useQuery } from "convex/react";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/Badge";

import { api } from "@/convex/_generated/api";

interface GroupsListProps {
  groups: Array<string>
}

export const GroupsList = ({
  groups
}: GroupsListProps) => {
  const transformedGroups = useQuery(api.groups.transform, { groups });

  if (transformedGroups === undefined) {
    return (
      <div className="flex flex-wrap gap-1">
        This user is not a part of any groups.
      </div>
    );
  }

  const stripped = transformedGroups.map(g => ({
    value: g.value, label: g.label, isTeamGroup: Boolean(g.isTeamGroup)
  }));

  const variant = (value: string, isTeamGroup: boolean) => {
    if (value.startsWith("exec")) return "executive";
    if (isTeamGroup) return "team";
    return "gy";
  };

  return (
    <div className="flex flex-wrap gap-1">
      {groups.length === 0 && (
        <div className="text-sm">
          This user is not a part of any groups.
        </div>
      )}
      {
        stripped.map((group: { value: string, label: string, isTeamGroup: boolean }, index: number) => (
          <Badge key={index} variant={variant(group.value, group.isTeamGroup)}>
            <Users className="w-4 h-4 mr-1" />
            {group.label}
          </Badge>
        ))
      }
    </div>
  );
};