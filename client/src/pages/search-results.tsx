import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useSearchParams } from "@/hooks/use-search-params";
import { FilterBar } from "@/components/ui/filter-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AllergyBadge } from "@/components/allergy-badge";
import { Product } from "@/types";
import { Heart, AlertCircle, Search, Store, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, navigate] = useLocation();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState("");
  const queryClient = useQueryClient();
  
  const query = searchParams.get("q") || "";
  const calorieRange = searchParams.get("calorieRange") || "";
  const proteinRange = searchParams.get("proteinRange") || "";
  const carbsRange = searchParams.get("carbsRange") || "";
  const fatRange = searchParams.get("fatRange") || "";
  const categoryId = searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId") || "0") : undefined;
  
  // 검색창 초기값 설정
  useEffect(() => {
    setSearchInput(query);
  }, [query]);
  
  // 검색할 조건이 있는지 확인 (검색어 또는 필터 중 하나라도)
  const hasSearchConditions = query.length > 0 || 
                             !!calorieRange || 
                             !!proteinRange || 
                             !!carbsRange || 
                             !!fatRange;
  
  // Create query parameter string
  const filterParams = new URLSearchParams();
  filterParams.append("q", query);
  
  // 영양소 필터는 클라이언트 측에서 처리하므로 서버 요청에 포함하지 않음
  // if (calorieRange) filterParams.append("calorieRange", calorieRange);
  // if (proteinRange) filterParams.append("proteinRange", proteinRange);
  // if (carbsRange) filterParams.append("carbsRange", carbsRange);
  // if (fatRange) filterParams.append("fatRange", fatRange);
  if (categoryId) filterParams.append("categoryId", categoryId.toString());
  
  // 검색 쿼리 함수
  const fetchSearchResults = async () => {
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
  };
  
  // 기본 검색 결과를 가져온다 (queryKey에 카테고리와 검색어만 포함)
  const { data: initialSearchResults, isLoading, error } = useQuery({
    queryKey: ['/api/search', { query, categoryId }],
    queryFn: fetchSearchResults,
    enabled: hasSearchConditions || categoryId !== undefined,
    staleTime: 1000 * 60 * 5 // 5분 동안 결과 캐시
  });
  
  // 초기 검색 결과와 필터된 결과를 별도로 관리
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  
  // 필터 적용 함수 - 이 함수를 직접 호출하여 결과를 필터링
  const applyFilters = (results: Product[]) => {
    if (!results || !Array.isArray(results)) {
      setFilteredResults([]);
      return;
    }
    
    // 필터가 없는 경우 모든 결과 표시
    if ((!calorieRange || parseInt(calorieRange) <= 0) && 
        (!proteinRange || parseInt(proteinRange) <= 0) && 
        (!carbsRange || parseInt(carbsRange) <= 0) && 
        (!fatRange || parseInt(fatRange) <= 0)) {
      setFilteredResults(results);
      return;
    }
    
    // 필터링 적용
    const filtered = results.filter(product => {
      // 칼로리 필터
      if (calorieRange && parseInt(calorieRange) > 0) {
        if (product.calories > parseInt(calorieRange)) return false;
      }
      
      // 단백질 필터
      if (proteinRange && parseInt(proteinRange) > 0) {
        if (product.protein > parseInt(proteinRange)) return false;
      }
      
      // 탄수화물 필터
      if (carbsRange && parseInt(carbsRange) > 0) {
        if (product.carbs > parseInt(carbsRange)) return false;
      }
      
      // 지방 필터
      if (fatRange && parseInt(fatRange) > 0) {
        if (product.fat > parseInt(fatRange)) return false;
      }
      
      // 모든 필터 조건을 통과
      return true;
    });
    
    setFilteredResults(filtered);
  };
  
  // 초기 검색 결과가 변경되거나 필터가 변경될 때마다 필터 적용
  useEffect(() => {
    console.log('필터 또는 검색 결과가 변경됨');
    if (initialSearchResults) {
      applyFilters(initialSearchResults);
    }
  }, [initialSearchResults, calorieRange, proteinRange, carbsRange, fatRange]);
  
  // 필터링된 검색 결과 (UI에서 표시할 데이터)
  const searchResults = filteredResults;
  
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
  
  // 검색 실행 함수
  const handleSearch = () => {
    // 빈 검색어 허용 (필터만으로도 검색)
    const newParams = new URLSearchParams(searchParams);
    
    // 검색어 업데이트 (빈 값이면 제거)
    if (searchInput.trim()) {
      newParams.set("q", searchInput.trim());
    } else {
      newParams.delete("q");
    }
    
    // 현재 필터값들 유지
    setSearchParams(newParams);
    
    // 쿼리 무효화하여 새로운 검색 결과 로드
    queryClient.invalidateQueries({ 
      queryKey: ['/api/search'] 
    });
    
    // 페이지 최상단으로 스크롤
    window.scrollTo(0, 0);
  };
  
  // Enter 키 누르면 검색 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // 필터 변경 시 실행할 함수 - FilterBar로부터 호출됨
  const handleFilterChange = (newFilters: any) => {
    console.log("필터 변경됨:", newFilters); // 디버깅용

    // 필터 파라미터는 FilterBar에서 이미 URL에 업데이트됨
    // 여기서는 아무것도 할 필요가 없음 (useEffect에서 URL 파라미터 변경 감지하여 필터링)
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Search className="w-6 h-6 text-primary mr-2" />
          <h1 className="text-3xl font-heading font-bold gradient-text">검색 결과</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="border-primary/20 hover:bg-primary/5 hover:text-primary"
        >
          홈으로 돌아가기
        </Button>
      </div>

      {/* 검색 입력 필드 */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="메뉴 이름으로 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button onClick={handleSearch} className="shadow-sm">
          검색
        </Button>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />
      
      <div className="mb-8 mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 bg-pink-50/60 py-2 px-4 rounded-lg inline-block border border-pink-100 shadow-sm">
            {query ? (
              <span>
                <span className="font-semibold text-pink-700">"{query}"</span>에 대한 검색 결과입니다
              </span>
            ) : (
              <span>
                <span className="font-semibold text-pink-700">필터 적용</span> 검색 결과입니다
              </span>
            )}
            {(calorieRange || proteinRange || carbsRange || fatRange) && (
              <span className="ml-2 text-xs bg-pink-200/70 px-2 py-1 rounded-full">
                필터 적용됨
              </span>
            )}
          </p>
          
          {/* 뷰 타입 전환 버튼 */}
          <div className="flex bg-pink-50 rounded-lg p-1 border border-pink-100">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-md ${viewType === 'grid' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setViewType('grid')}
              title="바둑판형 보기"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-md ${viewType === 'list' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setViewType('list')}
              title="목록형 보기"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
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
      ) : viewType === 'grid' ? (
        // 바둑판형 뷰 (Grid View) - 강제로 항상 2열 구성으로 변경
        <div className="grid grid-cols-2 gap-4">
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
      ) : (
        // 목록형 뷰 (List View)
        <div className="flex flex-col gap-4">
          {Array.isArray(searchResults) && searchResults.map((product: Product) => (
            <Card 
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden card-hover border border-pink-100"
              onClick={() => handleProductSelect(product.id)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 h-48 md:h-auto bg-gray-100 relative overflow-hidden">
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
                <CardContent className="p-4 border-t md:border-t-0 md:border-l border-pink-50 md:w-3/4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
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
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-4 md:mt-0 w-full md:w-auto">
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
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
