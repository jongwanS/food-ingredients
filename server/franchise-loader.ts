import * as fs from 'fs';
import * as path from 'path';
import { Product } from '../shared/schema';
import { storage } from './storage';

// 각 프랜차이즈 데이터를 로드하는 함수
export async function loadFranchiseData() {
  try {
    const franchiseDir = path.join(process.cwd(), 'seller/franchise');
    
    if (!fs.existsSync(franchiseDir)) {
      console.error('seller/franchise 디렉토리가 존재하지 않습니다.');
      return;
    }

    const franchises = await storage.getFranchises();
    
    for (const franchise of franchises) {
      const franchiseFileName = `${franchise.name}.json`;
      const franchiseFilePath = path.join(franchiseDir, franchiseFileName);
      
      if (fs.existsSync(franchiseFilePath)) {
        try {
          console.log(`${franchise.name} 데이터 로드 중...`);
          const franchiseData = JSON.parse(fs.readFileSync(franchiseFilePath, 'utf8'));
          
          // 각 프랜차이즈의 데이터를 우리 데이터 구조에 맞게 변환
          for (const item of franchiseData.slice(0, 20)) { // 일단 20개만 로드 (속도 문제로)
            try {
              // 데이터 필드 매핑
              const productData = {
                name: item.식품명?.replace(/^버거_|^피자_|^치킨_|^디저트_|^커피_|^음료_/g, '') || '알 수 없음',
                franchiseId: franchise.id,
                description: `${franchise.name}의 ${item.식품명?.replace(/^버거_|^피자_|^치킨_|^디저트_|^커피_|^음료_/g, '') || '알 수 없음'} 메뉴입니다.`,
                imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500", // 기본 이미지
                calories: Math.round(parseFloat(item["에너지(kcal)"] || "0")),
                protein: Math.round(parseFloat(item["단백질(g)"] || "0")),
                carbs: Math.round(parseFloat(item["탄수화물(g)"] || "0")),
                fat: Math.round(parseFloat(item["지방(g)"] || "0")),
                saturatedFat: Math.round(parseFloat(item["포화지방(g)"] || "0")),
                transFat: Math.round(parseFloat(item["트랜스지방(g)"] || "0")),
                cholesterol: Math.round(parseFloat(item["콜레스테롤(mg)"] || "0")),
                sodium: Math.round(parseFloat(item["나트륨(mg)"] || "0")),
                fiber: Math.round(parseFloat(item["식이섬유(g)"] || "0")),
                sugar: Math.round(parseFloat(item["당류(g)"] || "0")),
                calcium: Math.round(parseFloat(item["칼슘(mg)"] || "0")),
                iron: Math.round(parseFloat(item["철(mg)"] || "0")),
                vitaminD: Math.round(parseFloat(item["비타민D(µg)"] || "0")),
                allergens: [1, 2], // 기본 알러젠 (임시)
                featuredProduct: Math.random() > 0.8 // 20% 확률로 featured 제품으로 설정
              };
              
              // 이미 존재하는지 확인 후 추가
              const existingProducts = await storage.getProductsByFranchise(franchise.id);
              const exists = existingProducts.some(p => p.name === productData.name);
              
              if (!exists) {
                await storage.createProduct(productData);
                console.log(`제품 추가됨: ${productData.name} (${franchise.name})`);
              } else {
                console.log(`제품 이미 존재함: ${productData.name} (${franchise.name})`);
              }
            } catch (err) {
              const itemError = err as Error;
              console.error(`아이템 처리 중 오류: ${itemError.message}`);
            }
          }
        } catch (err) {
          const fileError = err as Error;
          console.error(`파일 처리 중 오류: ${franchiseFileName}: ${fileError.message}`);
        }
      } else {
        console.log(`${franchiseFileName} 파일이 존재하지 않습니다.`);
      }
    }
    
    console.log('모든 프랜차이즈 데이터 로드 완료!');
  } catch (error) {
    console.error('프랜차이즈 데이터 로드 중 오류:', error);
  }
}