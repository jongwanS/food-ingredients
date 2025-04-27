import fs from 'fs';
import path from 'path';
import { Product, Franchise, Category, Allergen } from '@shared/schema';

export interface KoreanFoodItem {
  식품코드: string;
  식품명: string;
  데이터구분코드: string;
  데이터구분명: string;
  식품기원코드: number;
  식품기원명: string;
  식품대분류코드: number;
  식품대분류명: string;
  대표식품코드: number;
  대표식품명: string;
  식품중분류코드: number;
  식품중분류명: string;
  식품소분류코드: number;
  식품소분류명: string;
  식품세분류코드: number;
  식품세분류명: string;
  영양성분함량기준량: string;
  '에너지(kcal)': number;
  '수분(g)': number | null;
  '단백질(g)': number;
  '지방(g)': number;
  '회분(g)': number | null;
  '탄수화물(g)': number;
  '당류(g)': number;
  '식이섬유(g)': number | null;
  '칼슘(mg)': number | null;
  '철(mg)': number | null;
  '인(mg)': number | null;
  '칼륨(mg)': number | null;
  '나트륨(mg)': number;
  '비타민 A(μg RAE)': number | null;
  '레티놀(μg)': number | null;
  '베타카로틴(μg)': number | null;
  '티아민(mg)': number | null;
  '리보플라빈(mg)': number | null;
  '니아신(mg)': number | null;
  '비타민 C(mg)': number | null;
  '비타민 D(μg)': number | null;
  '콜레스테롤(mg)': number;
  '포화지방산(g)': number;
  '트랜스지방산(g)': number;
  '식품중량'?: string | number | null; // 추가된 속성
}

// 프랜차이즈 매핑 정보
const franchiseMap: Record<string, { id: number; categoryId: number }> = {
  'mcdonalds': { id: 1, categoryId: 1 },
  'kfc': { id: 2, categoryId: 1 },
  'burgerking': { id: 3, categoryId: 1 },
  'lotteria': { id: 4, categoryId: 1 },
  'momstouch': { id: 5, categoryId: 1 }
};

export async function initializeData() {
  // 데이터 초기화 로직
  console.log('Data loader initialized');
}

export async function getAllergens(): Promise<Allergen[]> {
  return [];
}

export async function getCategories(): Promise<Category[]> {
  return [];
}

export async function getFranchises(): Promise<Franchise[]> {
  return [];
}

// 제품 데이터 로드
export async function loadProductData(): Promise<Product[]> {
  const products: Product[] = [];

  try {
    const franchiseDir = path.resolve('./seller/franchise');
    const franchiseFiles = fs.readdirSync(franchiseDir);
    let productId = 1;

    // 메뉴 데이터 로드
    for (const franchiseFile of franchiseFiles) {
      if (!franchiseFile.endsWith('.json')) continue;

      const franchiseName = franchiseFile.replace('.json', '');
      const franchiseInfo = franchiseMap[franchiseName];

      // 매핑된 프랜차이즈만 처리
      if (!franchiseInfo) continue;

      const filePath = path.join(franchiseDir, franchiseFile);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const menuItems: KoreanFoodItem[] = JSON.parse(fileContent);

      console.log(`로드 중: ${franchiseName} - ${menuItems.length}개 항목`);

      // 메뉴 항목 처리
      for (const item of menuItems) {
        const productName = item.식품명;
        let extractedWeight = 0;

        // 1. 먼저 식품중량 필드에서 바로 추출 시도 (타입 처리)
        if (typeof item['식품중량'] === 'string') {
          const weightMatch = item['식품중량'].match(/(\d+)g/i);
          if (weightMatch) {
            extractedWeight = parseInt(weightMatch[1]);
            console.log(`중량 추출 성공 (식품중량): ${productName} - ${extractedWeight}g`);
          }
        }

        // ... rest of the code ...
      }
    }

    return products;
  } catch (error) {
    console.error('제품 데이터 로드 중 오류 발생:', error);
    return [];
  }
}

// ... (나머지 코드는 동일) ...