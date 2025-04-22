import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  franchises, type Franchise, type InsertFranchise,
  allergens, type Allergen, type InsertAllergen,
  products, type Product, type InsertProduct,
  type ProductSearchParams
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // Users (keep for reference)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Franchises
  getFranchises(): Promise<Franchise[]>;
  getFranchise(id: number): Promise<Franchise | undefined>;
  getFranchisesByCategory(categoryId: number): Promise<Franchise[]>;
  createFranchise(franchise: InsertFranchise): Promise<Franchise>;

  // Allergens
  getAllergens(): Promise<Allergen[]>;
  getAllergen(id: number): Promise<Allergen | undefined>;
  createAllergen(allergen: InsertAllergen): Promise<Allergen>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByFranchise(franchiseId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(params: ProductSearchParams): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private _categories: Map<number, Category>;
  private _franchises: Map<number, Franchise>;
  private _allergens: Map<number, Allergen>;
  private _products: Map<number, Product>;
  
  currentUserId: number;
  currentCategoryId: number;
  currentFranchiseId: number;
  currentAllergenId: number;
  currentProductId: number;

  constructor() {
    this.users = new Map();
    this._categories = new Map();
    this._franchises = new Map();
    this._allergens = new Map();
    this._products = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentFranchiseId = 1;
    this.currentAllergenId = 1;
    this.currentProductId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User methods (keep for reference)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this._categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this._categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this._categories.set(id, category);
    return category;
  }

  // Franchise methods
  async getFranchises(): Promise<Franchise[]> {
    return Array.from(this._franchises.values());
  }

  async getFranchise(id: number): Promise<Franchise | undefined> {
    return this._franchises.get(id);
  }

  async getFranchisesByCategory(categoryId: number): Promise<Franchise[]> {
    return Array.from(this._franchises.values()).filter(
      franchise => franchise.categoryId === categoryId
    );
  }

  async createFranchise(insertFranchise: InsertFranchise): Promise<Franchise> {
    const id = this.currentFranchiseId++;
    const franchise: Franchise = { ...insertFranchise, id };
    this._franchises.set(id, franchise);
    return franchise;
  }

  // Allergen methods
  async getAllergens(): Promise<Allergen[]> {
    return Array.from(this._allergens.values());
  }

  async getAllergen(id: number): Promise<Allergen | undefined> {
    return this._allergens.get(id);
  }

  async createAllergen(insertAllergen: InsertAllergen): Promise<Allergen> {
    const id = this.currentAllergenId++;
    const allergen: Allergen = { ...insertAllergen, id };
    this._allergens.set(id, allergen);
    return allergen;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this._products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this._products.get(id);
  }

  async getProductsByFranchise(franchiseId: number): Promise<Product[]> {
    return Array.from(this._products.values()).filter(
      product => product.franchiseId === franchiseId
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    
    // 필수 필드에 기본값 설정 (description은 null이 될 수 있음)
    const normalizedAllergens: number[] | null = 
      insertProduct.allergens && Array.isArray(insertProduct.allergens) ? 
      insertProduct.allergens : null;
    
    const product: Product = { 
      // 먼저 원래 insertProduct에서 allergens 제거 (명시적으로 처리)
      name: insertProduct.name,
      franchiseId: insertProduct.franchiseId,
      imageUrl: insertProduct.imageUrl,
      calories: insertProduct.calories,
      protein: insertProduct.protein,
      carbs: insertProduct.carbs,
      fat: insertProduct.fat,
      
      // 나머지 필드는 null 값이 허용됨
      id,
      description: insertProduct.description || null,
      saturatedFat: insertProduct.saturatedFat || null,
      transFat: insertProduct.transFat || null,
      cholesterol: insertProduct.cholesterol || null, 
      sodium: insertProduct.sodium || null,
      fiber: insertProduct.fiber || null,
      sugar: insertProduct.sugar || null,
      calcium: insertProduct.calcium || null,
      iron: insertProduct.iron || null,
      vitaminD: insertProduct.vitaminD || null,
      allergens: normalizedAllergens,
      featuredProduct: insertProduct.featuredProduct !== undefined ? 
        insertProduct.featuredProduct : false
    };
    
    this._products.set(id, product);
    return product;
  }

  async searchProducts(params: ProductSearchParams): Promise<Product[]> {
    let results = Array.from(this._products.values());

    // Filter by search query (searches in name, description and category/franchise)
    if (params.query) {
      const queryLower = params.query.toLowerCase();
      
      // 검색어가 '치킨'인 경우, 치킨 카테고리의 프랜차이즈 ID 목록 가져오기
      const isChickenSearch = queryLower === '치킨' || queryLower === 'chicken';
      const chickenCategoryId = 2; // 치킨 카테고리 ID (카테고리 데이터에서 확인)
      
      // 치킨 카테고리에 속한 프랜차이즈 ID 목록
      const chickenFranchiseIds = isChickenSearch ? 
        Array.from(this._franchises.values())
          .filter(franchise => franchise.categoryId === chickenCategoryId)
          .map(franchise => franchise.id) : [];
      
      results = results.filter(product => 
        // 이름에 검색어 포함
        product.name.toLowerCase().includes(queryLower) ||
        // 설명에 검색어 포함 (설명이 있는 경우만)
        (product.description && product.description.toLowerCase().includes(queryLower)) || 
        // 치킨 검색 시 치킨 카테고리 프랜차이즈에 속한 제품도 포함
        (isChickenSearch && chickenFranchiseIds.includes(product.franchiseId))
      );
    }

    // Filter by franchise ID
    if (params.franchiseId) {
      results = results.filter(product => 
        product.franchiseId === params.franchiseId
      );
    }

    // Filter by category ID (this requires joining with franchises)
    if (params.categoryId) {
      const franchisesInCategory = Array.from(this._franchises.values())
        .filter(franchise => franchise.categoryId === params.categoryId)
        .map(franchise => franchise.id);
      
      results = results.filter(product => 
        franchisesInCategory.includes(product.franchiseId)
      );
    }

    // Filter by nutritional values
    if (params.minCalories !== undefined) {
      results = results.filter(product => product.calories >= params.minCalories!);
    }
    if (params.maxCalories !== undefined) {
      results = results.filter(product => product.calories <= params.maxCalories!);
    }
    if (params.minProtein !== undefined) {
      results = results.filter(product => product.protein >= params.minProtein!);
    }
    if (params.maxProtein !== undefined) {
      results = results.filter(product => product.protein <= params.maxProtein!);
    }
    if (params.minCarbs !== undefined) {
      results = results.filter(product => product.carbs >= params.minCarbs!);
    }
    if (params.maxCarbs !== undefined) {
      results = results.filter(product => product.carbs <= params.maxCarbs!);
    }
    if (params.minFat !== undefined) {
      results = results.filter(product => product.fat >= params.minFat!);
    }
    if (params.maxFat !== undefined) {
      results = results.filter(product => product.fat <= params.maxFat!);
    }

    return results;
  }

  // Initialize sample data
  private initializeData() {
    // Sample allergens
    const allergenData: InsertAllergen[] = [
      { name: "Wheat", nameKorean: "밀" },
      { name: "Milk", nameKorean: "유제품" },
      { name: "Eggs", nameKorean: "계란" },
      { name: "Fish", nameKorean: "생선" },
      { name: "Shellfish", nameKorean: "조개류" },
      { name: "Peanuts", nameKorean: "땅콩" },
      { name: "Tree Nuts", nameKorean: "견과류" },
      { name: "Soy", nameKorean: "대두" }
    ];
    
    allergenData.forEach(allergen => {
      this.createAllergen(allergen);
    });

    // Sample categories with cute emoji-style icons (copyright-free)
    const categoryData: InsertCategory[] = [
      { name: "Burger", nameKorean: "버거", imageUrl: "https://cdn-icons-png.flaticon.com/512/6978/6978255.png" },
      { name: "Chicken", nameKorean: "치킨", imageUrl: "https://cdn-icons-png.flaticon.com/512/7342/7342616.png" },
      { name: "Pizza", nameKorean: "피자", imageUrl: "https://cdn-icons-png.flaticon.com/512/6978/6978292.png" },
      { name: "Coffee/Drinks", nameKorean: "커피/음료", imageUrl: "https://cdn-icons-png.flaticon.com/512/6816/6816550.png" },
      { name: "Dessert", nameKorean: "디저트", imageUrl: "https://cdn-icons-png.flaticon.com/512/3361/3361447.png" },
      { name: "Korean", nameKorean: "한식", imageUrl: "https://cdn-icons-png.flaticon.com/512/2689/2689588.png" },
      { name: "Japanese", nameKorean: "일식", imageUrl: "https://cdn-icons-png.flaticon.com/512/2252/2252075.png" },
      { name: "Chinese", nameKorean: "중식", imageUrl: "https://cdn-icons-png.flaticon.com/512/2518/2518046.png" }
    ];
    
    const categories: Category[] = [];
    categoryData.forEach(category => {
      this.createCategory(category).then(cat => categories.push(cat));
    });

    // Sample franchises for burger category
    const franchiseData: InsertFranchise[] = [
      { name: "맥도날드", categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/FFC72C/D82A2A?text=M" },
      { name: "버거킹", categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/0033A0/ED7902?text=BK" },
      { name: "롯데리아", categoryId: 1, logoUrl: "https://via.placeholder.com/200x200/DA291C/FFFFFF?text=L" },
      { name: "KFC", categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/F40027/FFFFFF?text=KFC" },
      { name: "BBQ", categoryId: 2, logoUrl: "https://via.placeholder.com/200x200/800020/FFFFFF?text=BBQ" },
      { name: "도미노피자", categoryId: 3, logoUrl: "https://via.placeholder.com/200x200/006491/FFFFFF?text=DP" },
      { name: "스타벅스", categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/00704A/FFFFFF?text=SB" },
      { name: "투썸플레이스", categoryId: 4, logoUrl: "https://via.placeholder.com/200x200/B80F0A/FFFFFF?text=TS" }
    ];
    
    const franchises: Franchise[] = [];
    franchiseData.forEach(franchise => {
      this.createFranchise(franchise).then(fr => franchises.push(fr));
    });

    // Sample products for McDonald's
    const productData: InsertProduct[] = [
      {
        name: "빅맥",
        franchiseId: 1,
        description: "두 장의 순 쇠고기 패티에 빅맥만의 특별한 소스, 신선한 양상추, 치즈, 피클, 양파를 넣어 다양한 맛과 식감의 조화를 완성한 버거",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/5787/5787204.png",
        calories: 563,
        protein: 27,
        carbs: 45,
        fat: 30,
        saturatedFat: 11,
        transFat: 1,
        cholesterol: 85,
        sodium: 1010,
        fiber: 3,
        sugar: 9,
        calcium: 25,
        iron: 5,
        vitaminD: 0,
        allergens: [1, 2, 3, 8],
        featuredProduct: true
      },
      {
        name: "쿼터파운더 치즈",
        franchiseId: 1,
        description: "쿼터파운더 치즈는 100% 신선한 쇠고기 패티와 치즈, 양파, 피클이 들어간 클래식한 버거입니다.",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/5787/5787253.png",
        calories: 630,
        protein: 37,
        carbs: 40,
        fat: 35,
        saturatedFat: 16,
        transFat: 1,
        cholesterol: 115,
        sodium: 1250,
        fiber: 3,
        sugar: 10,
        calcium: 30,
        iron: 6,
        vitaminD: 0,
        allergens: [1, 2, 8],
        featuredProduct: false
      },
      {
        name: "맥치킨",
        franchiseId: 1,
        description: "맥치킨은 바삭한 치킨 패티와 신선한 양상추, 마요네즈가 들어간 샌드위치입니다.",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/5787/5787247.png",
        calories: 470,
        protein: 21,
        carbs: 42,
        fat: 27,
        saturatedFat: 5,
        transFat: 0,
        cholesterol: 65,
        sodium: 800,
        fiber: 2,
        sugar: 5,
        calcium: 15,
        iron: 3,
        vitaminD: 0,
        allergens: [1, 3, 8],
        featuredProduct: false
      },
      {
        name: "불고기 버거",
        franchiseId: 3,
        description: "한국적인 맛의 불고기 소스와 패티가 조화를 이루는 롯데리아의 대표 버거",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/5787/5787211.png",
        calories: 490,
        protein: 20,
        carbs: 55,
        fat: 22,
        saturatedFat: 7,
        transFat: 0,
        cholesterol: 60,
        sodium: 900,
        fiber: 2,
        sugar: 15,
        calcium: 10,
        iron: 4,
        vitaminD: 0,
        allergens: [1, 2, 8],
        featuredProduct: true
      },
      {
        name: "와퍼",
        franchiseId: 2,
        description: "불에 직접 구운 100% 순쇠고기 패티와 신선한 야채가 들어간 버거킹의 대표 메뉴",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/5787/5787262.png",
        calories: 670,
        protein: 29,
        carbs: 51,
        fat: 40,
        saturatedFat: 13,
        transFat: 1,
        cholesterol: 90,
        sodium: 1020,
        fiber: 3,
        sugar: 11,
        calcium: 20,
        iron: 5,
        vitaminD: 0,
        allergens: [1, 2, 8],
        featuredProduct: true
      },
      {
        name: "오리지널 치킨",
        franchiseId: 4,
        description: "KFC만의 비밀 레시피로 양념한 후 튀겨낸, 바삭하고 육즙이 풍부한 치킨",
        imageUrl: "https://cdn-icons-png.flaticon.com/512/7993/7993268.png",
        calories: 380,
        protein: 35,
        carbs: 9,
        fat: 23,
        saturatedFat: 6,
        transFat: 0,
        cholesterol: 120,
        sodium: 830,
        fiber: 0,
        sugar: 0,
        calcium: 5,
        iron: 2,
        vitaminD: 0,
        allergens: [1, 3],
        featuredProduct: true
      },
      {
        name: "아메리카노",
        franchiseId: 7,
        description: "진한 에스프레소와 뜨거운 물을 섞어 스타벅스의 깊고 풍부한 맛을 느낄 수 있는 음료",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500",
        calories: 5,
        protein: 0,
        carbs: 0,
        fat: 0,
        saturatedFat: 0,
        transFat: 0,
        cholesterol: 0,
        sodium: 10,
        fiber: 0,
        sugar: 0,
        calcium: 0,
        iron: 0,
        vitaminD: 0,
        allergens: [],
        featuredProduct: true
      },
      {
        name: "카페 라떼",
        franchiseId: 7,
        description: "진한 에스프레소와 스팀 밀크가 어우러져 부드러운 맛을 내는 클래식한 커피 음료",
        imageUrl: "https://images.unsplash.com/photo-1582202656844-15fddf4637b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500",
        calories: 190,
        protein: 13,
        carbs: 19,
        fat: 7,
        saturatedFat: 4,
        transFat: 0,
        cholesterol: 30,
        sodium: 170,
        fiber: 0,
        sugar: 18,
        calcium: 40,
        iron: 0,
        vitaminD: 15,
        allergens: [2],
        featuredProduct: false
      }
    ];
    
    productData.forEach(product => {
      this.createProduct(product);
    });
  }
}

export const storage = new MemStorage();
