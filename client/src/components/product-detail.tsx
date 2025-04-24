import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AllergyBadge } from "@/components/allergy-badge";
import { ArrowLeft, Heart, Droplet, AlertCircle, Gauge, Flame } from "lucide-react";

interface ProductDetailProps {
  productId: number;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [, navigate] = useLocation();
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: () => fetch(`/api/products/${productId}`).then(res => res.json()),
  });
  
  const handleBack = () => {
    // Go back to previous page
    window.history.back();
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
        <div className="md:flex">
          <div className="md:w-1/2">
            <Skeleton className="h-64 md:h-full w-full" />
          </div>
          <div className="md:w-1/2 p-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            
            <Skeleton className="h-10 w-48 rounded-md" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="text-center py-10 bg-pink-50 rounded-lg p-8 shadow-inner">
        <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4 opacity-80" />
        <p className="text-primary mb-2 font-semibold">제품 정보를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-600 mb-6">잠시 후 다시 시도해 주세요.</p>
        <Button 
          onClick={handleBack}
          className="bg-white hover:bg-white/90 text-primary shadow-sm border border-pink-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로 가기
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
      <div className="md:flex">
        <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          {product.featuredProduct && (
            <div className="absolute top-4 right-4 bg-pink-500/90 text-white text-xs py-1 px-3 rounded-full shadow-md flex items-center">
              <Heart className="h-3 w-3 mr-1" /> 인기 메뉴
            </div>
          )}
        </div>
        
        <div className="md:w-1/2 p-6">
          <h2 className="text-2xl font-heading font-bold mb-2 gradient-text">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          {/* Allergy Information */}
          {product.allergenDetails && product.allergenDetails.length > 0 && (
            <div className="mb-6 p-4 bg-pink-50/50 rounded-lg border border-pink-100">
              <h3 className="text-lg font-heading font-semibold mb-2 flex items-center text-pink-700">
                <AlertCircle className="h-4 w-4 mr-2" />
                알레르기 정보
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.allergenDetails.map((allergen: any, index: number) => (
                  <AllergyBadge key={index} name={allergen.nameKorean} />
                ))}
              </div>
            </div>
          )}
          
          <Button 
            className="mb-6 bg-white hover:bg-white/90 text-primary shadow-sm border border-pink-200"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>
      </div>
      
      {/* Nutritional Information */}
      <div className="p-6 border-t border-pink-100 bg-gradient-to-b from-white to-pink-50/30">
        <h3 className="text-xl font-heading font-semibold mb-4 gradient-text flex items-center">
          <Droplet className="h-5 w-5 mr-2 text-primary" />
          영양 정보
        </h3>
        
        <Tabs defaultValue="total" className="mb-6">
          <TabsList>
            <TabsTrigger value="total">전체 영양성분</TabsTrigger>
            <TabsTrigger value="per100g">100g 당 영양성분</TabsTrigger>
          </TabsList>
          
          <TabsContent value="total">
        
        {/* Nutrition Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-pink-100">
            <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
            <span className="block text-2xl font-bold text-primary">{product.calories}</span>
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
        
        {/* Detailed Nutritional Table */}
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
                <td className="py-3 px-4 text-right text-primary font-medium">{product.calories} kcal</td>
                <td className="py-3 px-4 text-right">{Math.round(product.calories / 2000 * 100)}%</td>
              </tr>
              <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-700">지방</td>
                <td className="py-3 px-4 text-right text-yellow-500 font-medium">{product.fat}g</td>
                <td className="py-3 px-4 text-right">{Math.round(product.fat / 65 * 100)}%</td>
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
          </TabsContent>
          
          <TabsContent value="per100g">
            {/* Nutrition Highlights per 100g */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-pink-100">
                <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="block text-2xl font-bold text-primary">{Math.round((product.calories / 246) * 100)}</span>
                <span className="text-sm text-gray-500">칼로리 (kcal)</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-green-100">
                <span className="block text-2xl font-bold text-green-500">{((product.protein / 246) * 100).toFixed(1)}g</span>
                <span className="text-sm text-gray-500">단백질</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-blue-100">
                <span className="block text-2xl font-bold text-blue-500">{((product.carbs / 246) * 100).toFixed(1)}g</span>
                <span className="text-sm text-gray-500">탄수화물</span>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm border border-yellow-100">
                <span className="block text-2xl font-bold text-yellow-500">{((product.fat / 246) * 100).toFixed(1)}g</span>
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
                    <td className="py-3 px-4 text-right text-primary font-medium">{Math.round((product.calories / 246) * 100)} kcal</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.calories / 246) * 100 / 2000 * 100)}%</td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">지방</td>
                    <td className="py-3 px-4 text-right text-yellow-500 font-medium">{((product.fat / 246) * 100).toFixed(1)}g</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.fat / 246) * 100 / 65 * 100)}%</td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 pl-8 text-gray-600">포화지방</td>
                    <td className="py-3 px-4 text-right text-orange-400">{((product.saturatedFat / 246) * 100).toFixed(1)}g</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.saturatedFat / 246) * 100 / 20 * 100)}%</td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 pl-8 text-gray-600">트랜스지방</td>
                    <td className="py-3 px-4 text-right text-orange-400">{((product.transFat / 246) * 100).toFixed(1)}g</td>
                    <td className="py-3 px-4 text-right">-</td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">콜레스테롤</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.cholesterol / 246) * 100)}mg</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.cholesterol / 246) * 100 / 300 * 100)}%</td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">나트륨</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.sodium / 246) * 100)}mg</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.sodium / 246) * 100 / 2400 * 100)}%</td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">탄수화물</td>
                    <td className="py-3 px-4 text-right text-blue-500 font-medium">{((product.carbs / 246) * 100).toFixed(1)}g</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.carbs / 246) * 100 / 300 * 100)}%</td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 pl-8 text-gray-600">식이섬유</td>
                    <td className="py-3 px-4 text-right">{((product.fiber / 246) * 100).toFixed(1)}g</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.fiber / 246) * 100 / 25 * 100)}%</td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 pl-8 text-gray-600">당류</td>
                    <td className="py-3 px-4 text-right">{((product.sugar / 246) * 100).toFixed(1)}g</td>
                    <td className="py-3 px-4 text-right">-</td>
                  </tr>
                  <tr className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">단백질</td>
                    <td className="py-3 px-4 text-right text-green-500 font-medium">{((product.protein / 246) * 100).toFixed(1)}g</td>
                    <td className="py-3 px-4 text-right">{Math.round((product.protein / 246) * 100 / 50 * 100)}%</td>
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
