import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Franchise } from "@/types";

interface FranchiseGridProps {
  categoryId: number;
}

export function FranchiseGrid({ categoryId }: FranchiseGridProps) {
  const [, navigate] = useLocation();
  
  // Fetch franchises by category
  const { data: franchises, isLoading, error } = useQuery({
    queryKey: ['/api/franchises', { categoryId }],
    queryFn: () => fetch(`/api/franchises?categoryId=${categoryId}`).then(res => res.json()),
  });
  
  const handleFranchiseSelect = (franchiseId: number) => {
    navigate(`/franchise/${franchiseId}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-32 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-2">프랜차이즈 정보를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-500">잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }
  
  if (franchises?.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-2">이 카테고리에 등록된 프랜차이즈가 없습니다.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {franchises?.map((franchise: Franchise) => (
        <Card 
          key={franchise.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleFranchiseSelect(franchise.id)}
        >
          <div className="h-40 bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-[200px] h-auto">
              <img 
                src={franchise.logoUrl} 
                alt={franchise.name} 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-heading font-semibold text-center">{franchise.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
