import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/types";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function CategoryGrid() {
  const [, navigate] = useLocation();
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  
  // Fetch categories from API
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()),
  });
  
  // Fetch franchises to check which categories have associated franchises
  const { data: franchises } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: () => fetch('/api/franchises').then(res => res.json()),
    enabled: !isLoading && !!categories,
  });
  
  // Filter out categories that don't have associated franchises
  useEffect(() => {
    if (categories && franchises) {
      // Get unique category IDs from franchises
      const categoryIds = new Set(franchises.map((franchise: any) => franchise.categoryId));
      
      // Filter categories to only those that have at least one franchise
      const validCategories = categories.filter((category: Category) => 
        categoryIds.has(category.id)
      );
      
      setFilteredCategories(validCategories);
    }
  }, [categories, franchises]);
  
  const handleCategorySelect = (categoryId: number) => {
    // 카테고리 ID에 해당하는 프랜차이즈 목록 페이지로 이동
    navigate(`/category/${categoryId}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="aspect-square">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10 bg-pink-50 rounded-lg p-8 shadow-inner">
        <p className="text-primary mb-2 font-semibold">카테고리를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-600">잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      {filteredCategories.map((category: Category) => (
        <div 
          key={category.id}
          className="aspect-square category-card card-hover rounded-xl overflow-hidden cursor-pointer"
          onClick={() => handleCategorySelect(category.id)}
        >
          <div className="h-full w-full bg-pink-50/80 border border-pink-100 rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-2">
            <div className="category-name flex flex-col justify-center items-center text-center">
              <h3 className="text-base font-heading font-semibold text-pink-700">{category.nameKorean}</h3>
              <Sparkles className="h-4 w-4 text-pink-400 mt-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
