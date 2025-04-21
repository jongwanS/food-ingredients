import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AllergyBadge } from "@/components/allergy-badge";
import { ArrowLeft } from "lucide-react";

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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-2">제품 정보를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-gray-500 mb-6">잠시 후 다시 시도해 주세요.</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로 가기
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 h-64 md:h-auto bg-gray-200 relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="md:w-1/2 p-6">
          <h2 className="text-2xl font-heading font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          {/* Allergy Information */}
          {product.allergenDetails && product.allergenDetails.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-heading font-semibold mb-2">알레르기 정보</h3>
              <div className="flex flex-wrap gap-2">
                {product.allergenDetails.map((allergen: any, index: number) => (
                  <AllergyBadge key={index} name={allergen.nameKorean} />
                ))}
              </div>
            </div>
          )}
          
          <Button 
            variant="secondary"
            className="mb-6"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>
      </div>
      
      {/* Nutritional Information */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-xl font-heading font-semibold mb-4">영양 정보</h3>
        
        {/* Nutrition Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <span className="block text-2xl font-bold text-primary">{product.calories}</span>
            <span className="text-sm text-gray-500">칼로리 (kcal)</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <span className="block text-2xl font-bold text-green-500">{product.protein}g</span>
            <span className="text-sm text-gray-500">단백질</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <span className="block text-2xl font-bold text-blue-500">{product.carbs}g</span>
            <span className="text-sm text-gray-500">탄수화물</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <span className="block text-2xl font-bold text-yellow-500">{product.fat}g</span>
            <span className="text-sm text-gray-500">총 지방</span>
          </div>
        </div>
        
        {/* Detailed Nutritional Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">영양소</th>
                <th className="py-3 px-4 text-right">함량</th>
                <th className="py-3 px-4 text-right">일일 권장량 대비 (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">칼로리</td>
                <td className="py-3 px-4 text-right">{product.calories} kcal</td>
                <td className="py-3 px-4 text-right">{Math.round(product.calories / 2000 * 100)}%</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">지방</td>
                <td className="py-3 px-4 text-right">{product.fat}g</td>
                <td className="py-3 px-4 text-right">{Math.round(product.fat / 65 * 100)}%</td>
              </tr>
              {product.saturatedFat !== null && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 pl-8">포화지방</td>
                  <td className="py-3 px-4 text-right">{product.saturatedFat}g</td>
                  <td className="py-3 px-4 text-right">{Math.round(product.saturatedFat / 20 * 100)}%</td>
                </tr>
              )}
              {product.transFat !== null && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 pl-8">트랜스지방</td>
                  <td className="py-3 px-4 text-right">{product.transFat}g</td>
                  <td className="py-3 px-4 text-right">-</td>
                </tr>
              )}
              {product.cholesterol !== null && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">콜레스테롤</td>
                  <td className="py-3 px-4 text-right">{product.cholesterol}mg</td>
                  <td className="py-3 px-4 text-right">{Math.round(product.cholesterol / 300 * 100)}%</td>
                </tr>
              )}
              {product.sodium !== null && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">나트륨</td>
                  <td className="py-3 px-4 text-right">{product.sodium}mg</td>
                  <td className="py-3 px-4 text-right">{Math.round(product.sodium / 2400 * 100)}%</td>
                </tr>
              )}
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">탄수화물</td>
                <td className="py-3 px-4 text-right">{product.carbs}g</td>
                <td className="py-3 px-4 text-right">{Math.round(product.carbs / 300 * 100)}%</td>
              </tr>
              {product.fiber !== null && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 pl-8">식이섬유</td>
                  <td className="py-3 px-4 text-right">{product.fiber}g</td>
                  <td className="py-3 px-4 text-right">{Math.round(product.fiber / 25 * 100)}%</td>
                </tr>
              )}
              {product.sugar !== null && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 pl-8">당류</td>
                  <td className="py-3 px-4 text-right">{product.sugar}g</td>
                  <td className="py-3 px-4 text-right">-</td>
                </tr>
              )}
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">단백질</td>
                <td className="py-3 px-4 text-right">{product.protein}g</td>
                <td className="py-3 px-4 text-right">{Math.round(product.protein / 50 * 100)}%</td>
              </tr>
              {product.calcium !== null && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">칼슘</td>
                  <td className="py-3 px-4 text-right">{product.calcium}%</td>
                  <td className="py-3 px-4 text-right">{product.calcium}%</td>
                </tr>
              )}
              {product.iron !== null && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">철분</td>
                  <td className="py-3 px-4 text-right">{product.iron}mg</td>
                  <td className="py-3 px-4 text-right">{Math.round(product.iron / 18 * 100)}%</td>
                </tr>
              )}
              {product.vitaminD !== null && (
                <tr>
                  <td className="py-3 px-4">비타민 D</td>
                  <td className="py-3 px-4 text-right">{product.vitaminD}mcg</td>
                  <td className="py-3 px-4 text-right">{Math.round(product.vitaminD / 20 * 100)}%</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <p className="mt-4 text-xs text-gray-500">
          * 퍼센트 일일 권장량은 2,000 칼로리 식이요법을 기준으로 합니다. 개인 칼로리 필요량에 따라 일일 권장치는 다를 수 있습니다.
        </p>
      </div>
    </div>
  );
}
