import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/types";

export function CategoryGrid() {
  const [, navigate] = useLocation();
  
  // Fetch categories from API
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()),
  });
  
  const handleCategorySelect = (categoryId: number) => {
    navigate(`/category/${categoryId}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-24 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-2">카테고리를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-500">잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {categories?.map((category: Category) => (
        <Card 
          key={category.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCategorySelect(category.id)}
        >
          <div className="h-40 bg-gray-200 relative overflow-hidden">
            <img 
              src={category.imageUrl} 
              alt={category.nameKorean} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-heading font-semibold">{category.nameKorean}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
