import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  path: string;
  current?: boolean;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex mb-6 text-sm font-medium", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-primary hover:underline">
            홈
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-gray-500" />
            <Link 
              href={item.path}
              className={
                item.current 
                  ? "text-gray-500 cursor-default" 
                  : "text-primary hover:underline"
              }
              onClick={item.current ? (e) => e.preventDefault() : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
