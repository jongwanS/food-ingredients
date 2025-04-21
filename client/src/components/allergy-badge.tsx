import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface AllergyBadgeProps {
  name: string;
  className?: string;
}

export function AllergyBadge({ name, className }: AllergyBadgeProps) {
  return (
    <span className={cn(
      "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm flex items-center border border-pink-200/40",
      className
    )}>
      <AlertTriangle className="w-3 h-3 mr-1" />
      {name}
    </span>
  );
}
