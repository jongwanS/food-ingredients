import { useState, useEffect } from "react";
import { useSearchParams } from "@/hooks/use-search-params";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  className?: string;
  onFilterChange?: (filters: {
    calorieRange: string;
    proteinRange: string;
    carbsRange: string;
    fatRange: string;
  }) => void;
}

export function FilterBar({ className, onFilterChange }: FilterBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    calorieRange: searchParams.get("calorieRange") || "0",
    proteinRange: searchParams.get("proteinRange") || "0",
    carbsRange: searchParams.get("carbsRange") || "0",
    fatRange: searchParams.get("fatRange") || "0"
  });

  const handleFilterChange = (value: string, filterName: string) => {
    // 값이 0인 경우 필터 제거 (빈 문자열로 설정)
    const newValue = value === "0" || value === "all" ? "" : value;
    
    setFilters(prev => ({
      ...prev,
      [filterName]: newValue
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
    
    // Call the onFilterChange callback if provided
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, setSearchParams, onFilterChange]);

  return (
    <div className={cn("mb-8 bg-white p-4 rounded-lg shadow-md", className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-xl font-heading font-bold mb-4 md:mb-0">필터</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
          {/* Calories Filter */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium">칼로리</Label>
              <span className="text-sm text-gray-500">{filters.calorieRange || 0} kcal 이하</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={1000}
              step={100}
              value={[parseInt(filters.calorieRange) || 0]}
              onValueChange={(value) => handleFilterChange(value[0].toString(), "calorieRange")}
              onValueCommit={(value) => {
                // 값이 변경되면 즉시 onFilterChange 호출
                if (onFilterChange) {
                  onFilterChange({
                    ...filters,
                    calorieRange: value[0].toString()
                  });
                }
              }}
              className="mb-4"
            />
          </div>
          
          {/* Protein Filter */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium">단백질</Label>
              <span className="text-sm text-gray-500">{filters.proteinRange || 0}g 이하</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={50}
              step={5}
              value={[parseInt(filters.proteinRange) || 0]}
              onValueChange={(value) => handleFilterChange(value[0].toString(), "proteinRange")}
              onValueCommit={(value) => {
                // 값이 변경되면 즉시 onFilterChange 호출
                if (onFilterChange) {
                  onFilterChange({
                    ...filters,
                    proteinRange: value[0].toString()
                  });
                }
              }}
              className="mb-4"
            />
          </div>
          
          {/* Carbs Filter */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium">탄수화물</Label>
              <span className="text-sm text-gray-500">{filters.carbsRange || 0}g 이하</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={100}
              step={10}
              value={[parseInt(filters.carbsRange) || 0]}
              onValueChange={(value) => handleFilterChange(value[0].toString(), "carbsRange")}
              onValueCommit={(value) => {
                // 값이 변경되면 즉시 onFilterChange 호출
                if (onFilterChange) {
                  onFilterChange({
                    ...filters,
                    carbsRange: value[0].toString()
                  });
                }
              }}
              className="mb-4"
            />
          </div>
          
          {/* Fat Filter */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium">지방</Label>
              <span className="text-sm text-gray-500">{filters.fatRange || 0}g 이하</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={50}
              step={5}
              value={[parseInt(filters.fatRange) || 0]}
              onValueChange={(value) => handleFilterChange(value[0].toString(), "fatRange")}
              onValueCommit={(value) => {
                // 값이 변경되면 즉시 onFilterChange 호출
                if (onFilterChange) {
                  onFilterChange({
                    ...filters,
                    fatRange: value[0].toString()
                  });
                }
              }}
              className="mb-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
