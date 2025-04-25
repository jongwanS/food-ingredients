import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AllergyBadge } from "@/components/allergy-badge";
import { ArrowLeft, Heart, Droplet, AlertCircle, Gauge, Flame, Store } from "lucide-react";
import { BannerAd, ResponsiveAd } from "@/components/ui/advertisement";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailProps {
  productId: number;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [, navigate] = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: () => fetch(`/api/products/${productId}`).then(res => res.json()),
  });
  
  // 좋아요 상태 체크
  useEffect(() => {
    if (product) {
      const favoritesString = localStorage.getItem('favorites');
      if (favoritesString) {
        try {
          const favorites = JSON.parse(favoritesString);
          const isProductFavorite = Array.isArray(favorites) && 
            favorites.some((fav: any) => fav.id === product.id);
          setIsFavorite(isProductFavorite);
        } catch (e) {
          console.error('로컬스토리지 에러:', e);
          setIsFavorite(false);
        }
      }
    }
  }, [product]);
  
  // Fetch franchises for franchise name
  const { data: franchises } = useQuery({
    queryKey: ['/api/franchises'],
    queryFn: () => fetch('/api/franchises').then(res => res.json()),
    enabled: !isLoading && !!product,
  });

  // Fetch categories for category name
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()),
    enabled: !isLoading && !!product,
  });
  
  // Fetch allergens
  const { data: allergens } = useQuery({
    queryKey: ['/api/allergens'],
    queryFn: () => fetch('/api/allergens').then(res => res.json()),
    enabled: !isLoading && !!product && !!product.allergens,
  });
  
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Skeleton className="h-14 w-3/4 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-72 rounded-xl" />
          <div>
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-24 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">제품 정보를 불러올 수 없습니다</h2>
          <p className="text-gray-600 mb-4">
            요청하신 제품 정보를 가져오는 중 오류가 발생했습니다. 
            다시 시도하거나 다른 제품을 확인해보세요.
          </p>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }
  
  const franchiseInfo = franchises?.find((franchise: any) => franchise.id === product.franchiseId);
  const categoryInfo = categories?.find((category: any) => category.id === product.categoryId);
  
  // 알러젠 객체 배열
  const allergenObjects = allergens && product.allergens
    ? product.allergens
        .map((allergenId: number) => allergens.find((a: any) => a.id === allergenId))
        .filter(Boolean)
    : [];
  
  // 좋아요 토글 함수
  const toggleFavorite = () => {
    let favorites = [];
    const favoritesString = localStorage.getItem('favorites');
    
    if (favoritesString) {
      try {
        favorites = JSON.parse(favoritesString);
        if (!Array.isArray(favorites)) favorites = [];
      } catch (e) {
        favorites = [];
      }
    }
    
    if (isFavorite) {
      // 좋아요 제거
      favorites = favorites.filter((fav: any) => fav.id !== product.id);
      setIsFavorite(false);
      toast({
        description: "즐겨찾기에서 제거되었습니다.",
        variant: "default",
      });
    } else {
      // 좋아요 추가
      const { id, name, franchiseId, calories, protein, carbs, fat } = product;
      const simplifiedProduct = { id, name, franchiseId, calories, protein, carbs, fat };
      favorites.push(simplifiedProduct);
      setIsFavorite(true);
      toast({
        description: "즐겨찾기에 추가되었습니다.",
        variant: "default",
      });
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };
  
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-pink-100">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold mb-1 gradient-text">
              {product.name}
            </h1>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Store className="h-4 w-4 mr-1" />
              <span>{franchiseInfo?.name || '정보 없음'}</span>
              {categoryInfo && (
                <>
                  <span className="mx-2">•</span>
                  <span>{categoryInfo.nameKorean}</span>
                </>
              )}
            </div>
            
            {/* Allergen Badges */}
            {allergenObjects && allergenObjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {allergenObjects.map((allergen: any) => (
                  <AllergyBadge key={allergen.id} name={allergen.nameKorean} />
                ))}
              </div>
            )}
          </div>
          
          {/* Favorite button */}
          <Button 
            variant="secondary" 
            className={`px-4 py-2 ${isFavorite ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-pink-100 hover:bg-pink-200'}`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-white" : ""}`} />
            {isFavorite ? "좋아요 취소" : "좋아요 추가"}
          </Button>
        </div>
      </div>
      
      {/* Ad Banner */}
      <div className="px-6 py-3 border-t border-pink-100 bg-white">
        <BannerAd className="w-full h-full max-h-24" />
      </div>
      
      {/* Nutritional Information */}
      <div className="p-6 border-t border-pink-100 bg-gradient-to-b from-white to-pink-50/30">
        <h3 className="text-xl font-heading font-semibold mb-4 gradient-text flex items-center">
          <Droplet className="h-5 w-5 mr-2 text-primary" />
          영양 정보
        </h3>
        
        <Tabs defaultValue={product.weight ? "total" : "per100g"} className="mb-6">
          <TabsList className="w-full">
            {product.weight && (
              <TabsTrigger value="total" className="flex-1">전체 영양성분</TabsTrigger>
            )}
            <TabsTrigger value="per100g" className="flex-1">100g 당 영양성분</TabsTrigger>
          </TabsList>
          
          {product.weight && (
            <TabsContent value="total">
              {/* 제품 중량 정보 */}
              <div className="bg-white p-4 rounded-lg mb-4 text-center border border-pink-100 shadow-sm">
                <h4 className="font-medium text-gray-700 mb-1">제품 중량</h4>
                <p className="text-xl font-bold text-pink-500">
                  {`${product.weight}g`}
                </p>
              </div>
            
              {/* 영양성분 하이라이트 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-pink-100">
                  <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <span className="block text-2xl font-bold text-primary">
                    {product.calories !== null ? product.calories : '-'}
                  </span>
                  <span className="text-sm text-gray-500">칼로리 (kcal)</span>
                </div>
                <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-green-100">
                  <span className="block text-2xl font-bold text-green-500">
                    {product.protein !== null ? `${product.protein}g` : '-'}
                  </span>
                  <span className="text-sm text-gray-500">단백질</span>
                </div>
                <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-blue-100">
                  <span className="block text-2xl font-bold text-blue-500">
                    {product.carbs !== null ? `${product.carbs}g` : '-'}
                  </span>
                  <span className="text-sm text-gray-500">탄수화물</span>
                </div>
                <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-yellow-100">
                  <span className="block text-2xl font-bold text-yellow-500">
                    {product.fat !== null ? `${product.fat}g` : '-'}
                  </span>
                  <span className="text-sm text-gray-500">총 지방</span>
                </div>
              </div>
              
              {/* 영양성분 상세표 */}
              <div className="overflow-x-auto rounded-lg border border-pink-100 shadow-sm bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-pink-50 to-pink-100/60">
                      <th className="py-3 px-4 text-left text-pink-800">영양소</th>
                      <th className="py-3 px-4 text-right text-pink-800">함량</th>
                      <th className="py-3 px-4 text-right text-pink-800">일일 권장량 대비 (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-700">칼로리</td>
                      <td className="py-3 px-4 text-right text-primary font-medium">
                        {product.calories !== null ? `${product.calories} kcal` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {product.calories !== null ? `${Math.round(product.calories / 2000 * 100)}%` : '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-700">지방</td>
                      <td className="py-3 px-4 text-right text-yellow-500 font-medium">
                        {product.fat !== null ? `${product.fat}g` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {product.fat !== null ? `${Math.round(product.fat / 65 * 100)}%` : '-'}
                      </td>
                    </tr>
                    {product.saturatedFat !== null && (
                      <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 pl-8 text-gray-600">포화지방</td>
                        <td className="py-3 px-4 text-right text-orange-400">{product.saturatedFat}g</td>
                        <td className="py-3 px-4 text-right">{Math.round(product.saturatedFat / 20 * 100)}%</td>
                      </tr>
                    )}
                    {product.transFat !== null && (
                      <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 pl-8 text-gray-600">트랜스지방</td>
                        <td className="py-3 px-4 text-right text-orange-400">{product.transFat}g</td>
                        <td className="py-3 px-4 text-right">-</td>
                      </tr>
                    )}
                    {product.cholesterol !== null && (
                      <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-700">콜레스테롤</td>
                        <td className="py-3 px-4 text-right">{product.cholesterol}mg</td>
                        <td className="py-3 px-4 text-right">{Math.round(product.cholesterol / 300 * 100)}%</td>
                      </tr>
                    )}
                    {product.sodium !== null && (
                      <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-700">나트륨</td>
                        <td className="py-3 px-4 text-right">{product.sodium}mg</td>
                        <td className="py-3 px-4 text-right">{Math.round(product.sodium / 2400 * 100)}%</td>
                      </tr>
                    )}
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-700">탄수화물</td>
                      <td className="py-3 px-4 text-right text-blue-500 font-medium">
                        {product.carbs !== null ? `${product.carbs}g` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {product.carbs !== null ? `${Math.round(product.carbs / 300 * 100)}%` : '-'}
                      </td>
                    </tr>
                    {product.fiber !== null && (
                      <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 pl-8 text-gray-600">식이섬유</td>
                        <td className="py-3 px-4 text-right">{product.fiber}g</td>
                        <td className="py-3 px-4 text-right">{Math.round(product.fiber / 25 * 100)}%</td>
                      </tr>
                    )}
                    {product.sugar !== null && (
                      <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 pl-8 text-gray-600">당류</td>
                        <td className="py-3 px-4 text-right">{product.sugar}g</td>
                        <td className="py-3 px-4 text-right">-</td>
                      </tr>
                    )}
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-700">단백질</td>
                      <td className="py-3 px-4 text-right text-green-500 font-medium">
                        {product.protein !== null ? `${product.protein}g` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {product.protein !== null ? `${Math.round(product.protein / 50 * 100)}%` : '-'}
                      </td>
                    </tr>
                    {product.calcium !== null && (
                      <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-700">칼슘</td>
                        <td className="py-3 px-4 text-right">{product.calcium}%</td>
                        <td className="py-3 px-4 text-right">{product.calcium}%</td>
                      </tr>
                    )}
                    {product.iron !== null && (
                      <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-700">철분</td>
                        <td className="py-3 px-4 text-right">{product.iron}mg</td>
                        <td className="py-3 px-4 text-right">{Math.round(product.iron / 18 * 100)}%</td>
                      </tr>
                    )}
                    {product.vitaminD !== null && (
                      <tr className="hover:bg-pink-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-700">비타민 D</td>
                        <td className="py-3 px-4 text-right">{product.vitaminD}mcg</td>
                        <td className="py-3 px-4 text-right">{Math.round(product.vitaminD / 20 * 100)}%</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <p className="mt-4 text-xs text-gray-500 bg-white p-3 rounded-lg border border-pink-100 shadow-sm">
                <span className="text-pink-500 font-medium">*</span> 퍼센트 일일 권장량은 2,000 칼로리 식이요법을 기준으로 합니다. 개인 칼로리 필요량에 따라 일일 권장치는 다를 수 있습니다.
              </p>
              
              {/* Ad component */}
              <div className="mt-6">
                <ResponsiveAd className="mx-auto" />
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="per100g">
            {/* Nutrition Highlights per 100g */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-pink-100">
                <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="block text-2xl font-bold text-primary">
                  {product.caloriesPer100g !== null ? product.caloriesPer100g : '-'}
                </span>
                <span className="text-sm text-gray-500">칼로리 (kcal)</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-green-100">
                <span className="block text-2xl font-bold text-green-500">
                  {product.proteinPer100g !== null ? `${product.proteinPer100g}g` : '-'}
                </span>
                <span className="text-sm text-gray-500">단백질</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-blue-100">
                <span className="block text-2xl font-bold text-blue-500">
                  {product.carbsPer100g !== null ? `${product.carbsPer100g}g` : '-'}
                </span>
                <span className="text-sm text-gray-500">탄수화물</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-yellow-100">
                <span className="block text-2xl font-bold text-yellow-500">
                  {product.fatPer100g !== null ? `${product.fatPer100g}g` : '-'}
                </span>
                <span className="text-sm text-gray-500">총 지방</span>
              </div>
            </div>

            {/* Detailed Nutritional Table per 100g */}
            <div className="overflow-x-auto rounded-lg border border-pink-100 shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-50 to-pink-100/60">
                    <th className="py-3 px-4 text-left text-pink-800">영양소</th>
                    <th className="py-3 px-4 text-right text-pink-800">100g당 함량</th>
                    <th className="py-3 px-4 text-right text-pink-800">일일 권장량 대비 (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">칼로리</td>
                    <td className="py-3 px-4 text-right text-primary font-medium">
                      {product.caloriesPer100g !== null ? `${product.caloriesPer100g} kcal` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.caloriesPer100g !== null ? `${Math.round(product.caloriesPer100g / 2000 * 100)}%` : '-'}
                    </td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">지방</td>
                    <td className="py-3 px-4 text-right text-yellow-500 font-medium">
                      {product.fatPer100g !== null ? `${product.fatPer100g}g` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.fatPer100g !== null ? `${Math.round(product.fatPer100g / 65 * 100)}%` : '-'}
                    </td>
                  </tr>
                  {product.saturatedFatPer100g !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 pl-8 text-gray-600">포화지방</td>
                      <td className="py-3 px-4 text-right text-orange-400">
                        {`${product.saturatedFatPer100g}g`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {`${Math.round(product.saturatedFatPer100g / 20 * 100)}%`}
                      </td>
                    </tr>
                  )}
                  {product.transFatPer100g !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 pl-8 text-gray-600">트랜스지방</td>
                      <td className="py-3 px-4 text-right text-orange-400">
                        {`${product.transFatPer100g}g`}
                      </td>
                      <td className="py-3 px-4 text-right">-</td>
                    </tr>
                  )}
                  {product.cholesterolPer100g !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-700">콜레스테롤</td>
                      <td className="py-3 px-4 text-right">
                        {`${product.cholesterolPer100g}mg`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {`${Math.round(product.cholesterolPer100g / 300 * 100)}%`}
                      </td>
                    </tr>
                  )}
                  {product.sodiumPer100g !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-700">나트륨</td>
                      <td className="py-3 px-4 text-right">
                        {`${product.sodiumPer100g}mg`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {`${Math.round(product.sodiumPer100g / 2400 * 100)}%`}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">탄수화물</td>
                    <td className="py-3 px-4 text-right text-blue-500 font-medium">
                      {product.carbsPer100g !== null ? `${product.carbsPer100g}g` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.carbsPer100g !== null ? `${Math.round(product.carbsPer100g / 300 * 100)}%` : '-'}
                    </td>
                  </tr>
                  {product.fiberPer100g !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 pl-8 text-gray-600">식이섬유</td>
                      <td className="py-3 px-4 text-right">
                        {`${product.fiberPer100g}g`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {`${Math.round(product.fiberPer100g / 25 * 100)}%`}
                      </td>
                    </tr>
                  )}
                  {product.sugarPer100g !== null && (
                    <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-4 pl-8 text-gray-600">당류</td>
                      <td className="py-3 px-4 text-right">
                        {`${product.sugarPer100g}g`}
                      </td>
                      <td className="py-3 px-4 text-right">-</td>
                    </tr>
                  )}
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">단백질</td>
                    <td className="py-3 px-4 text-right text-green-500 font-medium">
                      {product.proteinPer100g !== null ? `${product.proteinPer100g}g` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.proteinPer100g !== null ? `${Math.round(product.proteinPer100g / 50 * 100)}%` : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mt-4 text-xs text-gray-500 bg-white p-3 rounded-lg border border-pink-100 shadow-sm">
              <span className="text-pink-500 font-medium">*</span> 100g 당 영양성분 함량은 식품의약품안전처 식품영양성분 데이터베이스를 기준으로 합니다.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}