import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  franchises, type Franchise, type InsertFranchise,
  allergens, type Allergen, type InsertAllergen,
  products, type Product, type InsertProduct,
  type ProductSearchParams
} from "@shared/schema";
import * as dataLoader from './data/data-loader';

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
    
    // 데이터 초기화 (비동기)
    this.initializeData();
    
    // data-loader 초기화 호출
    dataLoader.initializeData();
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
      [...insertProduct.allergens] : null;
    
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

    // Filter by search query (searches in name, description, and franchise name)
    if (params.query) {
      const queryLower = params.query.toLowerCase();
      
      // 프랜차이즈 이름으로 검색
      const franchiseMatches = Array.from(this._franchises.values())
        .filter(franchise => 
          franchise.name.toLowerCase().includes(queryLower) // 부분 일치
        );
      
      // 매칭된 프랜차이즈가 있으면 해당 프랜차이즈의 제품만 필터링
      if (franchiseMatches.length > 0) {
        const matchingFranchiseIds = franchiseMatches.map(f => f.id);
        const franchiseResults = results.filter(product => 
          matchingFranchiseIds.includes(product.franchiseId)
        );
        
        // 매칭된 프랜차이즈 제품이 있으면 그 결과를 반환
        if (franchiseResults.length > 0) {
          return franchiseResults;
        }
      }
      
      // 프랜차이즈 검색 결과가 없으면 제품명, 설명으로 검색 계속 진행
      // 먼저 단어 완전 일치 검색
      const exactMatches = results.filter(product => 
        product.name.toLowerCase() === queryLower ||
        (product.description && product.description.toLowerCase() === queryLower)
      );
      
      if (exactMatches.length > 0) {
        return exactMatches;
      }
      
      // 단어 부분 일치 검색 (더 정확한 매칭)
      // 특수 케이스: "더블쿼터파운더" -> "더블", "쿼터", "파운더" 각각 검색
      const searchTokens = queryLower.split(/[\s-_]/);
      
      // 모든 토큰이 제품 이름에 포함된 제품 검색 (AND 조건)
      const tokenMatches = results.filter(product => {
        const productNameLower = product.name.toLowerCase();
        const productDescLower = product.description ? product.description.toLowerCase() : '';
        
        // 모든 토큰이 제품명에 포함되어 있는지 확인
        return searchTokens.every(token => 
          productNameLower.includes(token) || 
          productDescLower.includes(token)
        );
      });
      
      if (tokenMatches.length > 0) {
        return tokenMatches;
      }
      
      // 일부 토큰만 포함된 제품 검색 (OR 조건)
      const partialMatches = results.filter(product => {
        const productNameLower = product.name.toLowerCase();
        const productDescLower = product.description ? product.description.toLowerCase() : '';
        
        // 일부 토큰이라도 제품명에 포함되어 있는지 확인
        return searchTokens.some(token => 
          productNameLower.includes(token) || 
          productDescLower.includes(token)
        );
      });
      
      if (partialMatches.length > 0) {
        return partialMatches;
      }
      
      // 마지막으로 전체 문자열 부분 일치 검색
      results = results.filter(product => 
        product.name.toLowerCase().includes(queryLower) ||
        (product.description && product.description.toLowerCase().includes(queryLower))
      );
      
      // 결과가 없을 경우에만 카테고리/프랜차이즈 기반 검색
      if (results.length === 0) {
        // 검색어가 카테고리와 관련된 경우 (예: 치킨, 햄버거 등)
        const matchingCategories = Array.from(this._categories.values())
          .filter(category => 
            category.name.toLowerCase() === queryLower || 
            category.nameKorean.toLowerCase() === queryLower
          );
        
        // 카테고리 ID 목록
        const matchingCategoryIds = matchingCategories.map(category => category.id);
        
        // 해당 카테고리에 속한 프랜차이즈 ID 목록
        const matchingFranchiseIds = Array.from(this._franchises.values())
          .filter(franchise => matchingCategoryIds.includes(franchise.categoryId))
          .map(franchise => franchise.id);
        
        // 프랜차이즈 이름과 검색어 정확히 일치하는 것만 검색
        const franchisesMatchingQuery = Array.from(this._franchises.values())
          .filter(franchise => franchise.name.toLowerCase() === queryLower)
          .map(franchise => franchise.id);
        
        // 중복 제거하여 모든 매칭되는 프랜차이즈 ID 목록 생성
        const allMatchingFranchiseIds = Array.from(new Set([...matchingFranchiseIds, ...franchisesMatchingQuery]));
        
        results = Array.from(this._products.values()).filter(product => 
          // 정확히 일치하는 카테고리나 프랜차이즈에 속한 제품만 포함
          allMatchingFranchiseIds.includes(product.franchiseId)
        );
      }
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

  // Initialize data from data-loader
  private async initializeData() {
    try {
      // 알러젠 데이터 로드
      const allergenData = dataLoader.getAllergens();
      for (const allergen of allergenData) {
        const { id, ...insertData } = allergen;
        await this.createAllergen(insertData as InsertAllergen);
      }
      console.log("알러젠 데이터 로드 완료");

      // 카테고리 데이터 로드
      const categoryData = dataLoader.getCategories();
      for (const category of categoryData) {
        const { id, ...insertData } = category;
        await this.createCategory(insertData as InsertCategory);
      }
      console.log("카테고리 데이터 로드 완료");

      // 프랜차이즈 데이터 로드
      const franchiseData = dataLoader.getFranchises();
      for (const franchise of franchiseData) {
        const { id, ...insertData } = franchise;
        await this.createFranchise(insertData as InsertFranchise);
      }
      console.log("프랜차이즈 데이터 로드 완료");

      // 제품 데이터 로드 (비동기)
      const products = await dataLoader.loadProductData();
      for (const product of products) {
        const { id, ...insertData } = product;
        
        // 저장소 내부 정보에 의존하지 않도록 중복 확인
        if (!this._products.has(id)) {
          await this.createProduct(insertData as InsertProduct);
        }
      }
      console.log(`총 ${this._products.size}개 제품 로드 완료`);
    } catch (error) {
      console.error("데이터 초기화 중 오류 발생:", error);
    }


  }
}

export const storage = new MemStorage();
