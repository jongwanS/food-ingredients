import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useSearchParams } from "@/hooks/use-search-params";
import { FilterBar } from "@/components/ui/filter-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AllergyBadge } from "@/components/allergy-badge";
import { Product } from "@/types";
import { Heart, AlertCircle, Search, Store } from "lucide-react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [, navigate] = useLocation();
  
  const query = searchParams.get("query") || "";
  const calorieRange = searchParams.get("calorieRange") || "";
  const proteinRange = searchParams.get("proteinRange") || "";
  const carbsRange = searchParams.get("carbsRange") || "";
  const fatRange = searchParams.get("fatRange") || "";
  
  // Create query parameter string
  const filterParams = new URLSearchParams();
  filterParams.append("query", query);
  
  if (calorieRange) filterParams.append("calorieRange", calorieRange);
  if (proteinRange) filterParams.append("proteinRange", proteinRange);
  if (carbsRange) filterParams.append("carbsRange", carbsRange);
  if (fatRange) filterParams.append("fatRange", fatRange);
  
  // Fetch search results
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['/api/search', { query, calorieRange, proteinRange, carbsRange, fatRange }],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/search?${filterParams.toString()}`);
        if (!res.ok) {
          console.error('검색 API 응답 오류:', res.status);
          return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error('검색 API 요청 오류:', err);
        return [];
      }
    },
    enabled: query.length > 0
  });
  
  // Fetch allergens for badges
  const { data: allergens } = useQuery({
    queryKey: ['/api/allergens'],
    queryFn: () => fetch('/api/allergens').then(res => res.json()),
  });
  
  // Fetch franchises to display franchise names
  const { data: franchises } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: () => fetch('/api/franchises').then(res => res.json()),
  });
  
  // Get franchise name for a product
  const getFranchiseName = (franchiseId: number) => {
    if (!franchises) return "";
    const franchise = franchises.find((f: any) => f.id === franchiseId);
    return franchise ? franchise.name : "";
  };
  
  // Get allergen names for a product
  const getAllergenNames = (allergenIds: number[]) => {
    if (!allergens || !allergenIds) return [];
    return allergenIds.map(id => allergens.find((a: any) => a.id === id)?.nameKorean).filter(Boolean);
  };
  
  const handleProductSelect = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <FilterBar />
      
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Search className="w-6 h-6 text-primary mr-2" />
          <h1 className="text-3xl font-heading font-bold gradient-text">검색 결과</h1>
        </div>
        <p className="text-gray-600 bg-pink-50/60 py-2 px-4 rounded-lg inline-block border border-pink-100 shadow-sm">
          <span className="font-semibold text-pink-700">"{query}"</span>에 대한 검색 결과입니다
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden bg-white border border-pink-100 rounded-xl">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 border-t border-pink-50">
                <Skeleton className="h-4 w-32 mb-2 rounded-full" />
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-6 w-full rounded-md" />
                  <Skeleton className="h-6 w-full rounded-md" />
                  <Skeleton className="h-6 w-full rounded-md" />
                  <Skeleton className="h-6 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-pink-50 rounded-lg p-8 shadow-inner">
          <AlertCircle className="h-10 w-10 text-primary mx-auto mb-3 opacity-80" />
          <p className="text-primary mb-2 font-semibold">검색 중 오류가 발생했습니다.</p>
          <p className="text-sm text-gray-600">잠시 후 다시 시도해 주세요.</p>
        </div>
      ) : (!Array.isArray(searchResults) || searchResults.length === 0) ? (
        <div className="text-center py-12 bg-pink-50/50 rounded-lg p-8">
          <Search className="w-12 h-12 text-pink-300 mx-auto mb-4 opacity-50" />
          <p className="text-gray-600 mb-2 font-semibold">검색 결과가 없습니다.</p>
          <p className="text-sm text-gray-500">다른 검색어로 시도해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(searchResults) && searchResults.map((product: Product) => (
            <Card 
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden card-hover border border-pink-100"
              onClick={() => handleProductSelect(product.id)}
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {product.featuredProduct && (
                  <div className="absolute top-3 right-3 bg-pink-500/90 text-white text-xs py-1 px-2 rounded-full shadow-md flex items-center">
                    <Heart className="h-3 w-3 mr-1" /> 인기
                  </div>
                )}
              </div>
              <CardContent className="p-4 border-t border-pink-50">
                <div className="flex items-center text-xs font-medium text-pink-600 mb-1 bg-pink-50 py-1 px-2 rounded-full w-fit">
                  <Store className="h-3 w-3 mr-1" />
                  {getFranchiseName(product.franchiseId)}
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2 gradient-text">{product.name}</h3>
                
                {product.allergens && product.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getAllergenNames(product.allergens as number[]).map((allergen, idx) => (
                      <AllergyBadge key={idx} name={allergen as string} />
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm mt-3">
                  <div className="flex items-center bg-pink-50 px-2 py-1 rounded-md">
                    <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
                    <span className="text-gray-700">{product.calories} kcal</span>
                  </div>
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded-md">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-gray-700">{product.protein}g 단백질</span>
                  </div>
                  <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <span className="text-gray-700">{product.carbs}g 탄수화물</span>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                    <span className="text-gray-700">{product.fat}g 지방</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
