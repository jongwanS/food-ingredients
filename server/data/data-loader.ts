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
  { id: 5, name: "Dessert", nameKorean: "디저트/베이커리", imageUrl: "https://cdn-icons-png.flaticon.com/512/3361/3361447.png" },
  { id: 6, name: "Korean", nameKorean: "한식", imageUrl: "https://cdn-icons-png.flaticon.com/512/2689/2689588.png" },
  { id: 7, name: "Japanese", nameKorean: "일식", imageUrl: "https://cdn-icons-png.flaticon.com/512/2252/2252075.png" },
  { id: 8, name: "Chinese", nameKorean: "중식", imageUrl: "https://cdn-icons-png.flaticon.com/512/2518/2518046.png" },
  { id: 9, name: "Tea/Bubble Tea", nameKorean: "차/밀크티", imageUrl: "https://cdn-icons-png.flaticon.com/512/2935/2935416.png" },
  { id: 10, name: "Waffle/Toast", nameKorean: "와플/토스트", imageUrl: "https://cdn-icons-png.flaticon.com/512/5339/5339150.png" },
  { id: 11, name: "Meal Kit", nameKorean: "밀키트", imageUrl: "https://cdn-icons-png.flaticon.com/512/1147/1147805.png" },
  { id: 12, name: "Smoothie/Juice", nameKorean: "스무디/주스", imageUrl: "https://cdn-icons-png.flaticon.com/512/4489/4489244.png" }
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
  // 1. 버거 카테고리
  "맥도날드": { id: 1, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/FFC72C/D82A2A?text=M" },
  "버거킹": { id: 2, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/0033A0/ED7902?text=BK" },
  "롯데리아": { id: 3, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/DA291C/FFFFFF?text=L" },
  "KFC": { id: 4, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/F40027/FFFFFF?text=KFC" },
  "맘스터치": { id: 5, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/ED1C24/FFFFFF?text=MT" },
  "노브랜드버거": { id: 6, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/1E3D7B/FFFFFF?text=NB" },
  "프랭크버거": { id: 7, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/E1251B/FFFFFF?text=FB" },
  "앤티앤스": { id: 8, categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/4EA13E/FFFFFF?text=AA" },
  
  // 2. 치킨 카테고리
  "BBQ": { id: 9, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/800020/FFFFFF?text=BBQ" },
  "교촌치킨": { id: 10, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/1A1A1A/FFFFFF?text=KY" },
  "굽네치킨": { id: 11, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/FF6E2C/FFFFFF?text=GP" },
  "호식이두마리치킨": { id: 12, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/FF4C4C/FFFFFF?text=HS" },
  "치킨플러스": { id: 13, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/C73232/FFFFFF?text=CP" },
  "자담치킨": { id: 14, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/FFCE32/000000?text=JD" },
  "또래오래": { id: 15, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/FDBA0D/FFFFFF?text=TR" },
  "멕시카나": { id: 16, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/BD2222/FFFFFF?text=MX" },
  "비비큐": { id: 17, categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/E31837/FFFFFF?text=VQ" },
  
  // 3. 피자 카테고리
  "도미노피자": { id: 18, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/006491/FFFFFF?text=DP" },
  "피자헛": { id: 19, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/EE3124/FFFFFF?text=PH" },
  "미스터피자": { id: 20, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/007236/FFFFFF?text=MP" },
  "파파존스": { id: 21, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/006491/FFFFFF?text=PJ" },
  "피자알볼로": { id: 22, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/DB0007/FFFFFF?text=PA" },
  "피자마루": { id: 23, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/D62F28/FFFFFF?text=PM" },
  "피자스쿨": { id: 24, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/F26D21/FFFFFF?text=PS" },
  "청년피자": { id: 25, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/1B75BC/FFFFFF?text=YP" },
  "임실N치즈피자": { id: 26, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/FFC20E/FFFFFF?text=IC" },
  "7번가피자": { id: 27, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/F15A29/FFFFFF?text=7P" },
  "피자나라치킨공주": { id: 28, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/00A651/FFFFFF?text=PC" },
  "피자에땅": { id: 29, categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/A31F34/FFFFFF?text=PT" },
  
  // 4. 커피/음료 카테고리
  "스타벅스": { id: 30, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/00704A/FFFFFF?text=SB" },
  "투썸플레이스": { id: 31, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/B80F0A/FFFFFF?text=TS" },
  "이디야": { id: 32, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/1E3D94/FFFFFF?text=ED" },
  "메가커피": { id: 33, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/FFCE32/000000?text=MG" },
  "빽다방": { id: 34, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/FFCE32/000000?text=PK" },
  "커피빈": { id: 35, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/572C1A/FFFFFF?text=CB" },
  "할리스": { id: 36, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/C7001F/FFFFFF?text=HL" },
  "더벤티": { id: 37, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/0081C6/FFFFFF?text=TV" },
  "컴포즈커피": { id: 38, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/003B49/FFFFFF?text=CP" },
  "엔제리너스": { id: 39, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/880000/FFFFFF?text=AN" },
  "파스쿠찌": { id: 40, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/0066B3/FFFFFF?text=PC" },
  "드롭탑": { id: 41, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/472F91/FFFFFF?text=DT" },
  "탐앤탐스": { id: 42, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/DB0007/FFFFFF?text=TT" },
  "매머드 익스프레스": { id: 43, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/BA0C2F/FFFFFF?text=MM" },
  "토프레소": { id: 44, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/000000/FFFFFF?text=TO" },
  "더리터": { id: 45, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/0033A0/FFFFFF?text=TL" },
  "바나프레소": { id: 46, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/FFD800/000000?text=BP" },
  "블루샥": { id: 47, categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/0081C6/FFFFFF?text=BS" },
  
  // 5. 디저트/베이커리 카테고리
  "파리바게뜨": { id: 48, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/0066B3/FFFFFF?text=PB" },
  "뚜레쥬르": { id: 49, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/0066A6/FFFFFF?text=TL" },
  "던킨도너츠": { id: 50, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/FF671F/FFFFFF?text=DD" },
  "크리스피크림도넛": { id: 51, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/00A650/FFFFFF?text=KK" },
  "배스킨라빈스": { id: 52, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/F2207F/FFFFFF?text=BR" },
  "디저트39": { id: 53, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/A2216F/FFFFFF?text=D39" },
  "크로플덕오리아가씨": { id: 54, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/E57319/FFFFFF?text=CR" },
  "망원동티라미수": { id: 55, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/8B4513/FFFFFF?text=MT" },
  "롤링핀": { id: 56, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/C39B5F/FFFFFF?text=RP" },
  "크라상점": { id: 57, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/E9AB62/FFFFFF?text=CS" },
  "못난이꽈배기": { id: 58, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/EFB82C/FFFFFF?text=KW" },
  "요거트아이스크림의 정석": { id: 59, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/F2F2F2/FF69B4?text=YO" },
  "스트릿츄러스": { id: 60, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/E67E22/FFFFFF?text=SC" },
  "로띠번": { id: 61, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/C39B5F/FFFFFF?text=RT" },
  "비토랩": { id: 62, categoryId: 5, logoUrl: "https://via.placeholder.com/200x200/795548/FFFFFF?text=VT" },
  
  // 9. 차/밀크티 카테고리
  "공차": { id: 63, categoryId: 9, logoUrl: "https://via.placeholder.com/200x200/A52A2A/FFFFFF?text=GC" },
  "팔공티": { id: 64, categoryId: 9, logoUrl: "https://via.placeholder.com/200x200/8B4513/FFFFFF?text=P8" },
  "따삐오": { id: 65, categoryId: 9, logoUrl: "https://via.placeholder.com/200x200/FF69B4/FFFFFF?text=TP" },
  "달콤": { id: 66, categoryId: 9, logoUrl: "https://via.placeholder.com/200x200/FA8072/FFFFFF?text=DS" },
  
  // 10. 와플/토스트 카테고리
  "와플대학": { id: 67, categoryId: 10, logoUrl: "https://via.placeholder.com/200x200/F7931E/FFFFFF?text=WU" },
  "베러댄와플": { id: 68, categoryId: 10, logoUrl: "https://via.placeholder.com/200x200/F4B350/FFFFFF?text=BW" },
  "와플칸": { id: 69, categoryId: 10, logoUrl: "https://via.placeholder.com/200x200/E9B665/FFFFFF?text=WK" },
  
  // 11. 밀키트 카테고리
  "CJ 쿡킷": { id: 70, categoryId: 11, logoUrl: "https://via.placeholder.com/200x200/E31837/FFFFFF?text=CK" },
  "GS 리테일 심플리쿡": { id: 71, categoryId: 11, logoUrl: "https://via.placeholder.com/200x200/003B71/FFFFFF?text=GS" },
  "HY 잇츠온": { id: 72, categoryId: 11, logoUrl: "https://via.placeholder.com/200x200/0066B3/FFFFFF?text=HY" },
  "신세계푸드 피코크": { id: 73, categoryId: 11, logoUrl: "https://via.placeholder.com/200x200/4B7BAF/FFFFFF?text=PC" },
  
  // 12. 스무디/주스 카테고리
  "스무디킹": { id: 74, categoryId: 12, logoUrl: "https://via.placeholder.com/200x200/F2A629/FFFFFF?text=SK" },
  "마이요거트립": { id: 75, categoryId: 12, logoUrl: "https://via.placeholder.com/200x200/F75E73/FFFFFF?text=MY" },
  "요거프레소": { id: 76, categoryId: 12, logoUrl: "https://via.placeholder.com/200x200/BFFFC0/6F00FF?text=YP" }
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
                  productName.toLowerCase().includes('에스프레소') ||
                  productName.toLowerCase().includes('아메리카노')) {
          categoryId = 4; // 커피/음료 카테고리
        } else if (productCategory.includes('디저트') || 
                  productCategory.includes('케이크') ||
                  productName.toLowerCase().includes('케이크') ||
                  productName.toLowerCase().includes('쿠키') ||
                  productName.toLowerCase().includes('마카롱') ||
                  productName.toLowerCase().includes('빵') ||
                  productName.toLowerCase().includes('페이스트리') ||
                  productName.toLowerCase().includes('크림') ||
                  productName.toLowerCase().includes('티라미수') ||
                  productName.toLowerCase().includes('아이스크림')) {
          categoryId = 5; // 디저트 카테고리
        } else if (productCategory.includes('차') || 
                  productCategory.includes('티') ||
                  productName.toLowerCase().includes('밀크티') ||
                  productName.toLowerCase().includes('버블티') ||
                  productName.toLowerCase().includes('녹차') ||
                  productName.toLowerCase().includes('홍차')) {
          categoryId = 9; // 차/밀크티 카테고리
        } else if (productCategory.includes('와플') || 
                  productCategory.includes('토스트') ||
                  productName.toLowerCase().includes('와플') ||
                  productName.toLowerCase().includes('토스트')) {
          categoryId = 10; // 와플/토스트 카테고리
        } else if (productCategory.includes('밀키트') || 
                  productName.toLowerCase().includes('밀키트') ||
                  productName.toLowerCase().includes('쿡킷') ||
                  franchiseName.includes('쿡킷') ||
                  franchiseName.includes('심플리쿡') ||
                  franchiseName.includes('잇츠온') ||
                  franchiseName.includes('피코크')) {
          categoryId = 11; // 밀키트 카테고리
        } else if (productCategory.includes('스무디') || 
                  productCategory.includes('주스') ||
                  productName.toLowerCase().includes('스무디') ||
                  productName.toLowerCase().includes('주스') ||
                  productName.toLowerCase().includes('요거트')) {
          categoryId = 12; // 스무디/주스 카테고리
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