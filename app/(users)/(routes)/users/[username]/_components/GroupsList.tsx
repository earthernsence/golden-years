import { Option, transformGroups } from "@/components/groups";
import { Badge } from "@/components/ui/Badge";
import { Users } from "lucide-react";

interface GroupsListProps {
  groups: Array<string>
}

export const GroupsList = ({
  groups
}: GroupsListProps) => {
  const transformedGroups = transformGroups(groups);

  return (
    <div className="flex flex-wrap gap-1">
      {groups.length === 0 && (
        <div className="text-sm">
          This user is not a part of any groups.
        </div>
      )}
      {
        transformedGroups.map((group: Option, index: number) => (
          <Badge key={index} variant={group.value.startsWith("exec") ? "executive" : "gy"}>
            <Users className="w-4 h-4 mr-1" />
            {group.label}
          </Badge>
        ))
      }
    </div>
  );
};