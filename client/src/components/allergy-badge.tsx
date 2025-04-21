import { cn } from "@/lib/utils";

interface AllergyBadgeProps {
  name: string;
  className?: string;
}

export function AllergyBadge({ name, className }: AllergyBadgeProps) {
  return (
    <span className={cn(
      "bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded",
      className
    )}>
      {name}
    </span>
  );
}
