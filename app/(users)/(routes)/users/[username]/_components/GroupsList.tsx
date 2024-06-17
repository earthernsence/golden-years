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