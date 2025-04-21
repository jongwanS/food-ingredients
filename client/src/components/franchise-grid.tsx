import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Franchise } from "@/types";
import { Store, ArrowRightCircle } from "lucide-react";

interface FranchiseGridProps {
  categoryId: number;
}

export function FranchiseGrid({ categoryId }: FranchiseGridProps) {
  const [, navigate] = useLocation();
  
  // Fetch franchises by category
  const { data: franchises, isLoading, error } = useQuery({
    queryKey: ['/api/franchises', { categoryId }],
    queryFn: async () => {
      const response = await fetch(`/api/franchises?categoryId=${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch franchises');
      }
      return response.json();
    },
  });
  
  const handleFranchiseSelect = (franchiseId: number) => {
    navigate(`/franchise/${franchiseId}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden bg-white border border-pink-100">
            <div className="flex items-center justify-center p-6">
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            <CardContent className="p-4 border-t border-pink-50">
              <Skeleton className="h-6 w-32 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10 bg-pink-50 rounded-lg p-8 shadow-inner">
        <p className="text-primary mb-2 font-semibold">프랜차이즈 정보를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-600">잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }
  
  if (franchises?.length === 0) {
    return (
      <div className="text-center py-10 bg-pink-50/50 rounded-lg p-8">
        <Store className="w-12 h-12 text-pink-300 mx-auto mb-4 opacity-50" />
        <p className="text-gray-600 mb-2">이 카테고리에 등록된 프랜차이즈가 없습니다.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {franchises?.map((franchise: Franchise) => (
        <Card 
          key={franchise.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden card-hover border border-pink-100"
          onClick={() => handleFranchiseSelect(franchise.id)}
        >
          <div className="h-48 bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-6 relative">
            <div className="absolute top-3 right-3">
              <ArrowRightCircle className="h-5 w-5 text-primary opacity-70" />
            </div>
            <div className="w-full max-w-[160px] h-auto transition-transform duration-300 hover:scale-105">
              <img 
                src={franchise.logoUrl} 
                alt={franchise.name} 
                className="w-full h-auto object-contain drop-shadow-sm"
              />
            </div>
          </div>
          <CardContent className="p-4 border-t border-pink-50 text-center">
            <h3 className="text-lg font-heading font-semibold gradient-text">{franchise.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
