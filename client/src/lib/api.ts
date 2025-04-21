import { apiRequest } from "@/lib/queryClient";
import type { Category, Franchise, Product, ProductSearchResult, NutritionalFilter } from "@/types";

// API functions for data fetching

export async function getCategories(): Promise<Category[]> {
  const response = await apiRequest("GET", "/api/categories");
  return response.json();
}

export async function getCategory(id: number): Promise<Category> {
  const response = await apiRequest("GET", `/api/categories/${id}`);
  return response.json();
}

export async function getFranchises(): Promise<Franchise[]> {
  const response = await apiRequest("GET", "/api/franchises");
  return response.json();
}

export async function getFranchisesByCategory(categoryId: number): Promise<Franchise[]> {
  const response = await apiRequest("GET", `/api/franchises?categoryId=${categoryId}`);
  return response.json();
}

export async function getFranchise(id: number): Promise<Franchise> {
  const response = await apiRequest("GET", `/api/franchises/${id}`);
  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  const response = await apiRequest("GET", "/api/products");
  return response.json();
}

export async function getProductsByFranchise(franchiseId: number): Promise<Product[]> {
  const response = await apiRequest("GET", `/api/products?franchiseId=${franchiseId}`);
  return response.json();
}

export async function getProduct(id: number): Promise<Product> {
  const response = await apiRequest("GET", `/api/products/${id}`);
  return response.json();
}

export async function searchProducts(
  query?: string, 
  filters?: NutritionalFilter
): Promise<ProductSearchResult[]> {
  // Build query string
  const params = new URLSearchParams();
  
  if (query) {
    params.append("query", query);
  }
  
  if (filters) {
    if (filters.calorieRange) params.append("calorieRange", filters.calorieRange);
    if (filters.proteinRange) params.append("proteinRange", filters.proteinRange);
    if (filters.carbsRange) params.append("carbsRange", filters.carbsRange);
    if (filters.fatRange) params.append("fatRange", filters.fatRange);
  }
  
  const queryString = params.toString();
  const response = await apiRequest("GET", `/api/search${queryString ? `?${queryString}` : ""}`);
  return response.json();
}
