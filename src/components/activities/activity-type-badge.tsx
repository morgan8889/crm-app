import type { ActivityType } from "@prisma/client";
import { Mail, MessageSquare, Phone, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<ActivityType, { label: string; icon: typeof Phone; color: string }> = {
  CALL: { label: "Call", icon: Phone, color: "bg-green-100 text-green-800" },
  EMAIL: { label: "Email", icon: Mail, color: "bg-blue-100 text-blue-800" },
  MEETING: { label: "Meeting", icon: Users, color: "bg-purple-100 text-purple-800" },
  NOTE: { label: "Note", icon: MessageSquare, color: "bg-gray-100 text-gray-800" },
};

interface ActivityTypeBadgeProps {
  type: ActivityType;
}

export function ActivityTypeBadge({ type }: ActivityTypeBadgeProps) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        config.color
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
