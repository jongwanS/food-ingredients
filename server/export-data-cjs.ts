import * as fs from 'fs';
import * as path from 'path';
import { storage } from './storage';

// 데이터 내보내기 함수
async function exportData() {
  try {
    // seller 폴더가 없으면 생성
    const sellerDir = path.join(process.cwd(), 'seller');
    console.log('seller 폴더 경로:', sellerDir);
    
    if (!fs.existsSync(sellerDir)) {
      fs.mkdirSync(sellerDir, { recursive: true });
    }

    // 카테고리 데이터 내보내기
    const categories = await storage.getCategories();
    fs.writeFileSync(
      path.join(sellerDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    );
    console.log('카테고리 데이터가 seller/categories.json에 저장되었습니다.');

    // 프랜차이즈 데이터 내보내기
    const franchises = await storage.getFranchises();
    fs.writeFileSync(
      path.join(sellerDir, 'franchises.json'),
      JSON.stringify(franchises, null, 2)
    );
    console.log('프랜차이즈 데이터가 seller/franchises.json에 저장되었습니다.');

    // 제품 데이터 내보내기
    const products = await storage.getProducts();
    fs.writeFileSync(
      path.join(sellerDir, 'products.json'),
      JSON.stringify(products, null, 2)
    );
    console.log('제품 데이터가 seller/products.json에 저장되었습니다.');

    // 알러지 데이터 내보내기
    const allergens = await storage.getAllergens();
    fs.writeFileSync(
      path.join(sellerDir, 'allergens.json'),
      JSON.stringify(allergens, null, 2)
    );
    console.log('알러지 데이터가 seller/allergens.json에 저장되었습니다.');

  } catch (error) {
    console.error('데이터 내보내기 중 오류 발생:', error);
  }
}

// 함수 실행
exportData().then(() => {
  console.log('모든 데이터 내보내기가 완료되었습니다.');
});