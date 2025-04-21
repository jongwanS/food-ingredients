import { useState, useEffect } from "react";
import { useSearchParams } from "@/hooks/use-search-params";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  className?: string;
}

export function FilterBar({ className }: FilterBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    calorieRange: searchParams.get("calorieRange") || "",
    proteinRange: searchParams.get("proteinRange") || "",
    carbsRange: searchParams.get("carbsRange") || "",
    fatRange: searchParams.get("fatRange") || ""
  });

  const handleFilterChange = (value: string, filterName: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value === "all" ? "" : value
    }));
  };

  useEffect(() => {
    // Update URL search params when filters change
    const newParams = new URLSearchParams(searchParams);
    
    // Only add non-empty filters to the URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Update the URL with new params
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  return (
    <div className={cn("mb-8 bg-white p-4 rounded-lg shadow-md", className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-xl font-heading font-bold mb-4 md:mb-0">필터</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
          {/* Calories Filter */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">칼로리</Label>
            <Select
              value={filters.calorieRange || "all"}
              onValueChange={(value) => handleFilterChange(value, "calorieRange")}
            >
              <SelectTrigger>
                <SelectValue placeholder="모두" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모두</SelectItem>
                <SelectItem value="0-300">300 kcal 이하</SelectItem>
                <SelectItem value="300-500">300-500 kcal</SelectItem>
                <SelectItem value="500-800">500-800 kcal</SelectItem>
                <SelectItem value="800+">800 kcal 이상</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Protein Filter */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">단백질</Label>
            <Select
              value={filters.proteinRange || "all"}
              onValueChange={(value) => handleFilterChange(value, "proteinRange")}
            >
              <SelectTrigger>
                <SelectValue placeholder="모두" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모두</SelectItem>
                <SelectItem value="0-10">10g 이하</SelectItem>
                <SelectItem value="10-20">10-20g</SelectItem>
                <SelectItem value="20-30">20-30g</SelectItem>
                <SelectItem value="30+">30g 이상</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Carbs Filter */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">탄수화물</Label>
            <Select
              value={filters.carbsRange || "all"}
              onValueChange={(value) => handleFilterChange(value, "carbsRange")}
            >
              <SelectTrigger>
                <SelectValue placeholder="모두" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모두</SelectItem>
                <SelectItem value="0-30">30g 이하</SelectItem>
                <SelectItem value="30-60">30-60g</SelectItem>
                <SelectItem value="60-90">60-90g</SelectItem>
                <SelectItem value="90+">90g 이상</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Fat Filter */}
          <div className="flex flex-col">
            <Label className="text-sm font-medium mb-1">지방</Label>
            <Select
              value={filters.fatRange || "all"}
              onValueChange={(value) => handleFilterChange(value, "fatRange")}
            >
              <SelectTrigger>
                <SelectValue placeholder="모두" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모두</SelectItem>
                <SelectItem value="0-10">10g 이하</SelectItem>
                <SelectItem value="10-20">10-20g</SelectItem>
                <SelectItem value="20-30">20-30g</SelectItem>
                <SelectItem value="30+">30g 이상</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
