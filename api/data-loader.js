// Simple data loader for Vercel serverless functions

// Define basic data structures for Vercel API functions
const categories = [
  { id: 1, name: "Burger", nameKorean: "버거", imageUrl: "" },
  { id: 2, name: "Chicken", nameKorean: "치킨", imageUrl: "" },
  { id: 3, name: "Coffee", nameKorean: "커피", imageUrl: "" },
  { id: 4, name: "Bakery", nameKorean: "베이커리", imageUrl: "" },
  { id: 5, name: "Dessert", nameKorean: "디저트", imageUrl: "" },
];

const franchises = [
  { id: 1, name: "맥도날드", categoryId: 1, logoUrl: "", description: "글로벌 햄버거 체인" },
  { id: 2, name: "버거킹", categoryId: 1, logoUrl: "", description: "프리미엄 햄버거" },
  { id: 3, name: "롯데리아", categoryId: 1, logoUrl: "", description: "국내 대표 햄버거" },
  { id: 4, name: "KFC", categoryId: 2, logoUrl: "", description: "글로벌 치킨 체인" },
  { id: 5, name: "BBQ", categoryId: 2, logoUrl: "", description: "올리브 치킨" },
  { id: 6, name: "스타벅스", categoryId: 3, logoUrl: "", description: "글로벌 커피 체인" },
  { id: 7, name: "투썸플레이스", categoryId: 3, logoUrl: "", description: "디저트 카페" },
  { id: 8, name: "파리바게트", categoryId: 4, logoUrl: "", description: "프랑스 베이커리" },
  { id: 9, name: "뚜레쥬르", categoryId: 4, logoUrl: "", description: "CJ 베이커리" },
  { id: 10, name: "배스킨라빈스", categoryId: 5, logoUrl: "", description: "아이스크림" }
];

// Simple example product for fallback
const sampleProduct = {
  id: 2492,
  name: "더블불고기 버거",
  franchiseId: 1,
  categoryId: 1,
  description: "100g 기준",
  imageUrl: "",
  weight: 100,
  calories: 270,
  protein: 12.5,
  fat: 13.2,
  carbs: 26.3,
  sodium: 570,
  sugar: 4.2,
  cholesterol: 35,
  saturatedFat: 5.8,
  transFat: 0.3,
  allergens: [1, 2, 6]
};

// Function to redirect to client application
function redirectToClient(res) {
  res.writeHead(302, { Location: '/' });
  res.end();
}

// Export functions for API handlers
export function getCategories() {
  return categories;
}

export function getFranchises() {
  return franchises;
}

export function getFranchisesByCategory(categoryId) {
  return franchises.filter(f => f.categoryId === categoryId);
}

export function getCategory(id) {
  return categories.find(c => c.id === id);
}

export function getFranchise(id) {
  return franchises.find(f => f.id === id);
}

export function getProduct(id) {
  // In a real app, you'd search your product database
  // For now, just return the sample product if IDs match
  if (id === 2492) {
    return sampleProduct;
  }
  return null;
}

export { redirectToClient };