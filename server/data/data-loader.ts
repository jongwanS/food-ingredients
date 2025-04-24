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
}

// 카테고리 목록 (하드코딩)
const categories: Category[] = [
  { id: 1, name: "Burger", nameKorean: "버거", imageUrl: "https://cdn-icons-png.flaticon.com/512/6978/6978255.png" },
  { id: 2, name: "Chicken", nameKorean: "치킨", imageUrl: "https://cdn-icons-png.flaticon.com/512/7342/7342616.png" },
  { id: 3, name: "Pizza", nameKorean: "피자", imageUrl: "https://cdn-icons-png.flaticon.com/512/6978/6978292.png" },
  { id: 4, name: "Coffee/Drinks", nameKorean: "커피/음료", imageUrl: "https://cdn-icons-png.flaticon.com/512/6816/6816550.png" },
  { id: 5, name: "Dessert", nameKorean: "디저트", imageUrl: "https://cdn-icons-png.flaticon.com/512/3361/3361447.png" },
  { id: 6, name: "Korean", nameKorean: "한식", imageUrl: "https://cdn-icons-png.flaticon.com/512/2689/2689588.png" },
  { id: 7, name: "Japanese", nameKorean: "일식", imageUrl: "https://cdn-icons-png.flaticon.com/512/2252/2252075.png" },
  { id: 8, name: "Chinese", nameKorean: "중식", imageUrl: "https://cdn-icons-png.flaticon.com/512/2518/2518046.png" }
];

// 알러젠 목록 (하드코딩)
const allergens: Allergen[] = [
  { id: 1, name: "Wheat", nameKorean: "밀" },
  { id: 2, name: "Milk", nameKorean: "유제품" },
  { id: 3, name: "Eggs", nameKorean: "계란" },
  { id: 4, name: "Fish", nameKorean: "생선" },
  { id: 5, name: "Shellfish", nameKorean: "조개류" },
  { id: 6, name: "Peanuts", nameKorean: "땅콩" },
  { id: 7, name: "Tree Nuts", nameKorean: "견과류" },
  { id: 8, name: "Soy", nameKorean: "대두" }
];

// 프랜차이즈 정보 매핑
const franchiseMap: { [key: string]: { id: number, categoryId: number, logoUrl: string } } = {
  "맥도날드": { id: 1, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/FFC72C/D82A2A?text=M" },
  "버거킹": { id: 2, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/0033A0/ED7902?text=BK" },
  "롯데리아": { id: 3, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/DA291C/FFFFFF?text=L" },
  "KFC": { id: 4, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/F40027/FFFFFF?text=KFC" }, // KFC를 버거(1) 카테고리로 변경
  "BBQ": { id: 5, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/800020/FFFFFF?text=BBQ" },
  "도미노피자": { id: 6, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/006491/FFFFFF?text=DP" },
  "스타벅스": { id: 7, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/00704A/FFFFFF?text=SB" },
  "투썸플레이스": { id: 8, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/B80F0A/FFFFFF?text=TS" }
};

// 프랜차이즈 정보 생성
const franchises: Franchise[] = Object.entries(franchiseMap).map(([name, data]) => ({
  id: data.id,
  name,
  categoryId: data.categoryId,
  logoUrl: data.logoUrl
}));

// 제품 데이터 캐시
let cachedProducts: Map<number, Product> = new Map();
let initialized = false;

// 제품 데이터 로드
export async function loadProductData(): Promise<Product[]> {
  // 이미 초기화되었으면 캐시에서 반환
  if (initialized) {
    return Array.from(cachedProducts.values());
  }

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
        // 식품명에서 카테고리 제거 (예: "버거_빅맥" -> "빅맥")
        const nameParts = item.식품명.split('_');
        const productCategory = nameParts[0] || '';
        const productName = nameParts.length > 1 ? nameParts[1] : item.식품명;
        
        // 카테고리 ID 결정 (명시적 카테고리 매핑)
        let categoryId = franchiseInfo.categoryId; // 기본값은 프랜차이즈 카테고리
        
        // 제품명이나 카테고리명에 따라 카테고리 자동 분류
        if (productCategory.includes('버거') || 
            productName.toLowerCase().includes('버거') || 
            productName.toLowerCase().includes('와퍼') ||
            productName.toLowerCase().includes('불고기') ||
            franchiseName === 'KFC') {
          categoryId = 1; // 버거 카테고리
        } else if (productCategory.includes('치킨') || 
                  productName.toLowerCase().includes('치킨') || 
                  productName.toLowerCase().includes('윙') ||
                  productName.toLowerCase().includes('봉')) {
          categoryId = 2; // 치킨 카테고리
        } else if (productCategory.includes('피자') || 
                  productName.toLowerCase().includes('피자')) {
          categoryId = 3; // 피자 카테고리
        } else if (productCategory.includes('커피') || 
                  productCategory.includes('음료') ||
                  productName.toLowerCase().includes('커피') ||
                  productName.toLowerCase().includes('라떼') ||
                  productName.toLowerCase().includes('에스프레소')) {
          categoryId = 4; // 커피/음료 카테고리
        } else if (productCategory.includes('디저트') || 
                  productCategory.includes('케이크') ||
                  productName.toLowerCase().includes('케이크') ||
                  productName.toLowerCase().includes('쿠키') ||
                  productName.toLowerCase().includes('마카롱')) {
          categoryId = 5; // 디저트 카테고리
        }
        
        // 랜덤 이미지 URL (카테고리별로 다른 이미지 선택)
        let imageUrl = "https://cdn-icons-png.flaticon.com/512/5787/5787253.png"; // 기본 이미지
        
        // 카테고리 ID에 따라 이미지 설정
        switch (categoryId) {
          case 1: // 버거
            imageUrl = "https://cdn-icons-png.flaticon.com/512/5787/5787253.png";
            break;
          case 2: // 치킨
            imageUrl = "https://cdn-icons-png.flaticon.com/512/7993/7993268.png";
            break;
          case 3: // 피자
            imageUrl = "https://cdn-icons-png.flaticon.com/512/6978/6978292.png";
            break;
          case 4: // 커피/음료
            imageUrl = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500";
            break;
          case 5: // 디저트
            imageUrl = "https://cdn-icons-png.flaticon.com/512/3361/3361447.png";
            break;
        }
        
        // 알러젠 임의 할당 (실제 데이터에 따라 조정 필요)
        const allergenIds: number[] = [];
        if (productCategory.includes('버거') || productCategory.includes('샌드위치')) {
          allergenIds.push(1, 2, 8); // 밀, 유제품, 대두
        }
        if (productName.toLowerCase().includes('치즈')) {
          allergenIds.push(2); // 유제품
        }
        if (productName.toLowerCase().includes('에그')) {
          allergenIds.push(3); // 계란
        }
        
        // 중복 제거
        const uniqueAllergens = Array.from(new Set(allergenIds));
        
        // 제품 무게 추정 (g 단위)
        // 카테고리별 평균 중량 추정
        let estimatedWeight = 0;
        
        // 카테고리 ID에 따른 추정 무게 설정
        switch (categoryId) {
          case 1: // 버거
            estimatedWeight = 250; // 버거 평균 무게 (g)
            break;
          case 2: // 치킨
            estimatedWeight = 200; // 치킨류 평균 무게 (g)
            break;
          case 3: // 피자
            estimatedWeight = 300; // 피자 슬라이스 평균 무게 (g)
            break;
          case 4: // 커피/음료
            estimatedWeight = 350; // 음료 평균 무게 (mL)
            break;
          case 5: // 디저트
            estimatedWeight = 120; // 디저트류 평균 무게 (g)
            break;
          default:
            // 제품 이름에 따른 추정
            if (productName.toLowerCase().includes('샌드위치')) {
              estimatedWeight = 220; // 샌드위치 평균 무게 (g)
            } else {
              estimatedWeight = 200; // 기본 추정 무게 (g)
            }
        }
        
        // 특정 키워드에 따라 중량 추가 조정
        if (productName.includes('더블') || productName.includes('라지') || productName.includes('빅')) {
          estimatedWeight *= 1.5; // 더블/라지/빅 메뉴는 50% 더 무거움
        } else if (productName.includes('미니') || productName.includes('스몰')) {
          estimatedWeight *= 0.7; // 미니/스몰 메뉴는 30% 더 가벼움
        }
        
        // 롯데리아 미라클 버거 같은 특별한 경우 처리
        if (franchiseName === '롯데리아' && productName.includes('미라클')) {
          estimatedWeight = 320; // 미라클 버거는 무게가 더 나감
        }
        
        // 100g당 영양성분을 전체 제품 영양성분으로 환산 (중량 기반)
        const weightFactor = estimatedWeight / 100; // 100g 대비 비율
        
        // 총 지방 계산 로직: 총 지방이 null이고 포화지방이 있으면 포화지방으로 총 지방 추정
        let totalFat = Math.round(Number(item['지방(g)']) * weightFactor * 10) / 10;
        const saturatedFat = item['포화지방산(g)'] ? Math.round(Number(item['포화지방산(g)']) * weightFactor * 10) / 10 : null;
        
        // 총 지방이 없지만 포화지방이 있는 경우, 포화지방을 기준으로 총 지방을 추정 (포화지방은 총 지방의 일부)
        if ((!totalFat || isNaN(totalFat)) && saturatedFat) {
          // 포화지방이 총 지방의 약 30-50%를 차지한다고 가정하고 계산
          totalFat = Math.round(saturatedFat * 2 * 10) / 10; // 포화지방의 2배로 추정
        }
        
        // 제품 정보 생성 (영양성분 환산 적용)
        const product: Product = {
          id: productId++,
          name: productName,
          franchiseId: franchiseInfo.id,
          description: `${franchiseName}의 ${productName} 메뉴입니다.`,
          imageUrl: imageUrl,
          categoryId: categoryId, // 자동 분류된 카테고리 ID 설정
          calories: Math.round(Number(item['에너지(kcal)']) * weightFactor) || 0,
          protein: Math.round(Number(item['단백질(g)']) * weightFactor * 10) / 10 || 0,
          carbs: Math.round(Number(item['탄수화물(g)']) * weightFactor * 10) / 10 || 0,
          fat: totalFat || 0, // 추정된 총 지방 사용
          saturatedFat: saturatedFat,
          transFat: item['트랜스지방산(g)'] ? Math.round(Number(item['트랜스지방산(g)']) * weightFactor * 10) / 10 : null,
          cholesterol: item['콜레스테롤(mg)'] ? Math.round(Number(item['콜레스테롤(mg)']) * weightFactor) : null,
          sodium: item['나트륨(mg)'] ? Math.round(Number(item['나트륨(mg)']) * weightFactor) : null,
          fiber: null,
          sugar: item['당류(g)'] ? Math.round(Number(item['당류(g)']) * weightFactor * 10) / 10 : null,
          calcium: null,
          iron: null,
          vitaminD: null,
          allergens: uniqueAllergens.length > 0 ? uniqueAllergens : null,
          featuredProduct: false // 기본값으로 설정
        };
        
        // 특정 제품은 인기 제품으로 표시
        if (
          productName.includes('빅맥') || 
          productName.includes('와퍼') || 
          productName.includes('불고기') ||
          productName.includes('오리지널')
        ) {
          product.featuredProduct = true;
        }
        
        // 캐시에 저장
        cachedProducts.set(product.id, product);
        console.log(`제품 추가됨: ${product.name} (${franchiseName})`);
      }
    }
    
    console.log(`총 ${cachedProducts.size}개 제품 로드 완료`);
    initialized = true;
    return Array.from(cachedProducts.values());
  } catch (error) {
    console.error('제품 데이터 로드 중 오류 발생:', error);
    return [];
  }
}

// 제품 검색
export async function searchProducts(query?: string, categoryId?: number, franchiseId?: number, nutritionalFilter?: any): Promise<Product[]> {
  // 데이터가 로드되지 않았으면 먼저 로드
  if (!initialized) {
    await loadProductData();
  }
  
  let results = Array.from(cachedProducts.values());
  
  // 검색어로 필터링
  if (query) {
    const queryLower = query.toLowerCase();
    
    // 검색어를 토큰으로 분리 (예: "더블쿼터파운더" -> ["더블", "쿼터", "파운더"])
    const searchTokens = queryLower.split(/[\s-_]/);
    
    // 1. 정확히 일치하는 제품 찾기
    const exactMatches = results.filter(product => 
      product.name.toLowerCase() === queryLower ||
      (product.description && product.description.toLowerCase() === queryLower)
    );
    
    if (exactMatches.length > 0) {
      return exactMatches;
    }
    
    // 2. 모든 토큰이 제품 이름에 포함된 제품 찾기 (AND 검색)
    const tokenMatches = results.filter(product => {
      const productNameLower = product.name.toLowerCase();
      const productDescLower = product.description ? product.description.toLowerCase() : '';
      
      return searchTokens.every(token => 
        productNameLower.includes(token) || 
        productDescLower.includes(token)
      );
    });
    
    if (tokenMatches.length > 0) {
      return tokenMatches;
    }
    
    // 3. 일부 토큰이라도 포함된 제품 찾기 (OR 검색)
    const partialMatches = results.filter(product => {
      const productNameLower = product.name.toLowerCase();
      const productDescLower = product.description ? product.description.toLowerCase() : '';
      
      return searchTokens.some(token => 
        productNameLower.includes(token) || 
        productDescLower.includes(token)
      );
    });
    
    if (partialMatches.length > 0) {
      results = partialMatches;
    } else {
      // 4. 위의 방법으로 찾지 못했을 경우 부분 문자열 검색
      results = results.filter(product => 
        product.name.toLowerCase().includes(queryLower) ||
        (product.description && product.description.toLowerCase().includes(queryLower))
      );
    }
  }
  
  // 카테고리 ID로 필터링
  if (categoryId) {
    // 해당 카테고리의 프랜차이즈 ID 목록 찾기
    const categoryFranchiseIds = franchises
      .filter(franchise => franchise.categoryId === categoryId)
      .map(franchise => franchise.id);
    
    results = results.filter(product => 
      categoryFranchiseIds.includes(product.franchiseId)
    );
  }
  
  // 프랜차이즈 ID로 필터링
  if (franchiseId) {
    results = results.filter(product => product.franchiseId === franchiseId);
  }
  
  // 영양소 필터링
  if (nutritionalFilter) {
    // 칼로리 필터
    if (nutritionalFilter.minCalories !== undefined) {
      results = results.filter(product => product.calories >= nutritionalFilter.minCalories);
    }
    if (nutritionalFilter.maxCalories !== undefined) {
      results = results.filter(product => product.calories <= nutritionalFilter.maxCalories);
    }
    
    // 단백질 필터
    if (nutritionalFilter.minProtein !== undefined) {
      results = results.filter(product => product.protein >= nutritionalFilter.minProtein);
    }
    if (nutritionalFilter.maxProtein !== undefined) {
      results = results.filter(product => product.protein <= nutritionalFilter.maxProtein);
    }
    
    // 탄수화물 필터
    if (nutritionalFilter.minCarbs !== undefined) {
      results = results.filter(product => product.carbs >= nutritionalFilter.minCarbs);
    }
    if (nutritionalFilter.maxCarbs !== undefined) {
      results = results.filter(product => product.carbs <= nutritionalFilter.maxCarbs);
    }
    
    // 지방 필터
    if (nutritionalFilter.minFat !== undefined) {
      results = results.filter(product => product.fat >= nutritionalFilter.minFat);
    }
    if (nutritionalFilter.maxFat !== undefined) {
      results = results.filter(product => product.fat <= nutritionalFilter.maxFat);
    }
  }
  
  return results;
}

// 데이터 초기화 함수 (서버 시작 시 호출)
export function initializeData() {
  loadProductData()
    .then(() => console.log('데이터 초기화 완료'))
    .catch(error => console.error('데이터 초기화 실패:', error));
}

// 카테고리, 프랜차이즈, 알러젠 데이터 가져오기
export function getCategories(): Category[] {
  return categories;
}

export function getFranchises(): Franchise[] {
  return franchises;
}

export function getAllergens(): Allergen[] {
  return allergens;
}

// 특정 ID로 데이터 찾기
export function getCategoryById(id: number): Category | undefined {
  return categories.find(category => category.id === id);
}

export function getFranchiseById(id: number): Franchise | undefined {
  return franchises.find(franchise => franchise.id === id);
}

export function getAllergenById(id: number): Allergen | undefined {
  return allergens.find(allergen => allergen.id === id);
}

export function getProductById(id: number): Product | undefined {
  return cachedProducts.get(id);
}

// 특정 프랜차이즈의 제품 가져오기
export function getProductsByFranchise(franchiseId: number): Product[] {
  return Array.from(cachedProducts.values())
    .filter(product => product.franchiseId === franchiseId);
}