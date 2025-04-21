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
    calories: searchParams.get("calories") || "0",
    protein: searchParams.get("protein") || "0",
    carbs: searchParams.get("carbs") || "0",
    fat: searchParams.get("fat") || "0"
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
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium">칼로리</Label>
              <span className="text-sm text-gray-500">{filters.calories || 0} kcal 이하</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={1000}
              step={100}
              value={[parseInt(filters.calories) || 0]}
              onValueChange={(value) => handleFilterChange(value[0].toString(), "calories")}
              className="mb-4"
            />
          </div>
          
          {/* Protein Filter */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium">단백질</Label>
              <span className="text-sm text-gray-500">{filters.protein || 0}g 이하</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={50}
              step={5}
              value={[parseInt(filters.protein) || 0]}
              onValueChange={(value) => handleFilterChange(value[0].toString(), "protein")}
              className="mb-4"
            />
          </div>
          
          {/* Carbs Filter */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium">탄수화물</Label>
              <span className="text-sm text-gray-500">{filters.carbs || 0}g 이하</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={100}
              step={10}
              value={[parseInt(filters.carbs) || 0]}
              onValueChange={(value) => handleFilterChange(value[0].toString(), "carbs")}
              className="mb-4"
            />
          </div>
          
          {/* Fat Filter */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium">지방</Label>
              <span className="text-sm text-gray-500">{filters.fat || 0}g 이하</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={50}
              step={5}
              value={[parseInt(filters.fat) || 0]}
              onValueChange={(value) => handleFilterChange(value[0].toString(), "fat")}
              className="mb-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
