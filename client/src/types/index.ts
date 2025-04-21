// Types for the API responses

export interface Category {
  id: number;
  name: string;
  nameKorean: string;
  imageUrl: string;
}

export interface Franchise {
  id: number;
  name: string;
  categoryId: number;
  logoUrl: string;
}

export interface Allergen {
  id: number;
  name: string;
  nameKorean: string;
}

export interface Product {
  id: number;
  name: string;
  franchiseId: number;
  description?: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  fiber?: number;
  sugar?: number;
  calcium?: number;
  iron?: number;
  vitaminD?: number;
  allergens?: number[] | null;
  allergenDetails?: Allergen[];
  featuredProduct: boolean;
}

export interface ProductSearchResult extends Product {
  franchiseName?: string;
  categoryName?: string;
}

export interface NutritionalFilter {
  calorieRange?: string;
  proteinRange?: string;
  carbsRange?: string;
  fatRange?: string;
}
