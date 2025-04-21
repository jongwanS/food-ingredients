import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useSearchParams } from "@/hooks/use-search-params";
import { FilterBar } from "@/components/ui/filter-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AllergyBadge } from "@/components/allergy-badge";
import { Product } from "@/types";

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
    queryFn: () => fetch(`/api/search?${filterParams.toString()}`).then(res => res.json()),
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
      
      <h1 className="text-3xl font-heading font-bold mb-2">검색 결과</h1>
      <p className="text-gray-500 mb-6">"{query}"에 대한 검색 결과입니다.</p>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-2">검색 중 오류가 발생했습니다.</p>
          <p className="text-sm text-gray-500">잠시 후 다시 시도해 주세요.</p>
        </div>
      ) : searchResults?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-2">검색 결과가 없습니다.</p>
          <p className="text-sm text-gray-500">다른 검색어로 시도해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults?.map((product: Product) => (
            <Card 
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProductSelect(product.id)}
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="text-xs font-medium text-gray-500 mb-1">
                  {getFranchiseName(product.franchiseId)}
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">{product.name}</h3>
                
                {product.allergens && product.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getAllergenNames(product.allergens as number[]).map((allergen, idx) => (
                      <AllergyBadge key={idx} name={allergen as string} />
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-primary mr-2"></span>
                    <span>{product.calories} kcal</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                    <span>{product.protein}g 단백질</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                    <span>{product.carbs}g 탄수화물</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
                    <span>{product.fat}g 지방</span>
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
