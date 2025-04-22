import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/types";
import { Sparkles } from "lucide-react";

export function CategoryGrid() {
  const [, navigate] = useLocation();
  
  // Fetch categories from API
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()),
  });
  
  const handleCategorySelect = (categoryId: number) => {
    // 카테고리 ID로 직접 검색 결과 페이지로 이동
    navigate(`/search?categoryId=${categoryId}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="category-card">
            <Skeleton className="h-48 w-full rounded-lg" />
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {categories?.map((category: Category) => (
        <div 
          key={category.id}
          className="category-card card-hover rounded-xl overflow-hidden cursor-pointer"
          onClick={() => handleCategorySelect(category.id)}
        >
          <div className="h-48 bg-pink-50/80 border border-pink-100 rounded-xl relative overflow-hidden flex flex-col items-center justify-center">
            <img 
              src={category.imageUrl} 
              alt={category.nameKorean} 
              className="w-24 h-24 object-contain mb-2 transition-transform duration-300 hover:scale-110"
            />
            <div className="category-name flex justify-center items-center mt-2 bg-white/70 rounded-full px-4 py-1 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-pink-700">{category.nameKorean}</h3>
              <Sparkles className="h-4 w-4 text-pink-400 ml-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
