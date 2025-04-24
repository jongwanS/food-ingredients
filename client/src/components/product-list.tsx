import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AllergyBadge } from "@/components/allergy-badge";
import { Product } from "@/types";
import { useSearchParams } from "@/hooks/use-search-params";
import { Heart, AlertCircle, Flame } from "lucide-react";

interface ProductListProps {
  franchiseId: number;
}

export function ProductList({ franchiseId }: ProductListProps) {
  const [, navigate] = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get filter params from URL
  const calorieRange = searchParams.get("calorieRange") || "";
  const proteinRange = searchParams.get("proteinRange") || "";
  const carbsRange = searchParams.get("carbsRange") || "";
  const fatRange = searchParams.get("fatRange") || "";
  
  // Create query parameter string
  const filterParams = new URLSearchParams();
  filterParams.append("franchiseId", franchiseId.toString());
  
  if (calorieRange) filterParams.append("calorieRange", calorieRange);
  if (proteinRange) filterParams.append("proteinRange", proteinRange);
  if (carbsRange) filterParams.append("carbsRange", carbsRange);
  if (fatRange) filterParams.append("fatRange", fatRange);
  
  // Fetch products by franchise with filters
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products', { franchiseId, calorieRange, proteinRange, carbsRange, fatRange }],
    queryFn: async () => {
      try {
        // Use /api/search only when filters are applied
        const hasFilters = calorieRange || proteinRange || carbsRange || fatRange;
        let endpoint = '';
        if (hasFilters) {
          // 검색 API를 사용하고 필터 파라미터 추가
          endpoint = `/api/search?franchiseId=${franchiseId}`;
          if (calorieRange) endpoint += `&calorieRange=${calorieRange}`;
          if (proteinRange) endpoint += `&proteinRange=${proteinRange}`;
          if (carbsRange) endpoint += `&carbsRange=${carbsRange}`;
          if (fatRange) endpoint += `&fatRange=${fatRange}`;
        } else {
          // 필터가 없으면 기본 제품 API 사용
          endpoint = `/api/products?franchiseId=${franchiseId}`;
        }
        
        const res = await fetch(endpoint);
        if (!res.ok) {
          console.error('API 응답 오류:', res.status);
          return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error('API 요청 오류:', err);
        return [];
      }
    },
  });
  
  // Fetch allergens for badges
  const { data: allergens } = useQuery({
    queryKey: ['/api/allergens'],
    queryFn: () => fetch('/api/allergens').then(res => res.json()),
  });
  
  const handleProductSelect = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  // Get allergen names for a product
  const getAllergenNames = (allergenIds: number[]) => {
    if (!allergens || !allergenIds) return [];
    return allergenIds.map(id => allergens.find((a: any) => a.id === id)?.nameKorean).filter(Boolean);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
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
        <AlertCircle className="h-10 w-10 text-primary mx-auto mb-3 opacity-80" />
        <p className="text-primary mb-2 font-semibold">메뉴 정보를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-600">잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }
  
  if (products?.length === 0) {
    return (
      <div className="text-center py-10 bg-pink-50/50 rounded-lg p-8">
        <Flame className="w-12 h-12 text-pink-300 mx-auto mb-4 opacity-50" />
        <p className="text-gray-600 mb-2">선택한 필터 조건에 맞는 메뉴가 없습니다.</p>
        <p className="text-sm text-gray-500">필터 조건을 변경해 보세요.</p>
      </div>
    );
  }
  
  // 먼저 products가 배열인지 확인
  const productArray = Array.isArray(products) ? products : [];
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {productArray.map((product: Product) => (
        <div 
          key={product.id}
          className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden card-hover border border-pink-100 cursor-pointer"
          onClick={() => handleProductSelect(product.id)}
        >
          <div className="h-full w-full flex flex-col p-3">
            {/* 제품 이름 영역 */}
            <div className="mb-2 text-center">
              <h3 className="text-base font-heading font-semibold gradient-text line-clamp-2">{product.name}</h3>
              {product.featuredProduct && (
                <div className="inline-flex mt-1 bg-pink-500/90 text-white text-xs py-0.5 px-1.5 rounded-full shadow-sm items-center">
                  <Heart className="h-2.5 w-2.5 mr-0.5" /> 인기
                </div>
              )}
            </div>
            
            {/* 알러지 정보 */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 justify-center">
                {getAllergenNames(product.allergens as number[]).slice(0, 2).map((allergen, idx) => (
                  <AllergyBadge key={idx} name={allergen as string} className="text-xs" />
                ))}
                {getAllergenNames(product.allergens as number[]).length > 2 && (
                  <span className="text-xs text-pink-600">+{getAllergenNames(product.allergens as number[]).length - 2}</span>
                )}
              </div>
            )}
            
            {/* 영양 정보 */}
            <div className="grid grid-cols-2 gap-1 text-xs mt-auto">
              <div className="flex items-center bg-pink-50 px-1.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
                <span className="text-gray-700">{product.calories} kcal</span>
              </div>
              <div className="flex items-center bg-green-50 px-1.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                <span className="text-gray-700 truncate">
                  {product.protein !== null ? `${product.protein}g 단백질` : '정보 없음'}
                </span>
              </div>
              <div className="flex items-center bg-blue-50 px-1.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                <span className="text-gray-700 truncate">
                  {product.carbs !== null ? `${product.carbs}g 탄수화물` : '정보 없음'}
                </span>
              </div>
              <div className="flex items-center bg-yellow-50 px-1.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                <span className="text-gray-700 truncate">
                  {product.fat !== null ? `${product.fat}g 지방` : '정보 없음'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
