import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { productSearchSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiRouter = app.route("/api");

  // Categories API endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Failed to fetch category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Franchises API endpoints
  app.get("/api/franchises", async (req, res) => {
    try {
      // Get franchises by category if categoryId is provided
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (categoryId) {
        if (isNaN(categoryId)) {
          return res.status(400).json({ message: "Invalid category ID" });
        }
        
        const franchises = await storage.getFranchisesByCategory(categoryId);
        return res.json(franchises);
      }
      
      // Otherwise get all franchises
      const franchises = await storage.getFranchises();
      res.json(franchises);
    } catch (error) {
      console.error("Failed to fetch franchises:", error);
      res.status(500).json({ message: "Failed to fetch franchises" });
    }
  });

  app.get("/api/franchises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid franchise ID" });
      }

      const franchise = await storage.getFranchise(id);
      if (!franchise) {
        return res.status(404).json({ message: "Franchise not found" });
      }

      res.json(franchise);
    } catch (error) {
      console.error("Failed to fetch franchise:", error);
      res.status(500).json({ message: "Failed to fetch franchise" });
    }
  });

  // Allergens API endpoints
  app.get("/api/allergens", async (req, res) => {
    try {
      const allergens = await storage.getAllergens();
      res.json(allergens);
    } catch (error) {
      console.error("Failed to fetch allergens:", error);
      res.status(500).json({ message: "Failed to fetch allergens" });
    }
  });

  app.get("/api/allergens/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid allergen ID" });
      }

      const allergen = await storage.getAllergen(id);
      if (!allergen) {
        return res.status(404).json({ message: "Allergen not found" });
      }

      res.json(allergen);
    } catch (error) {
      console.error("Failed to fetch allergen:", error);
      res.status(500).json({ message: "Failed to fetch allergen" });
    }
  });

  // Products API endpoints
  app.get("/api/products", async (req, res) => {
    try {
      // If franchiseId is provided, get products for that franchise
      const franchiseId = req.query.franchiseId ? parseInt(req.query.franchiseId as string) : undefined;
      
      if (franchiseId) {
        if (isNaN(franchiseId)) {
          return res.status(400).json({ message: "Invalid franchise ID" });
        }
        
        const products = await storage.getProductsByFranchise(franchiseId);
        return res.json(products);
      }
      
      // Otherwise get all products
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Fetch allergen details for the product
      if (product.allergens && Array.isArray(product.allergens)) {
        const allergenPromises = product.allergens.map(id => storage.getAllergen(id as number));
        const allergenObjects = await Promise.all(allergenPromises);
        
        // Add allergen details to the response
        const response = {
          ...product,
          allergenDetails: allergenObjects.filter(a => a !== undefined)
        };
        
        return res.json(response);
      }

      res.json(product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Search API endpoint
  app.get("/api/search", async (req, res) => {
    try {
      // 직접 파라미터를 추출하여 처리
      const searchParams: any = {
        query: req.query.query,
        franchiseId: req.query.franchiseId ? parseInt(req.query.franchiseId as string) : undefined,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined
      };
      
      // Handle range-based filters
      const parsedParams: any = { ...searchParams };
      
      // Parse calorie ranges (슬라이더 값 직접 처리)
      if (req.query.calorieRange) {
        const calorieRange = req.query.calorieRange as string;
        // 숫자로 직접 전달되는 경우 (슬라이더에서 직접 설정한 값)
        if (!isNaN(Number(calorieRange)) && Number(calorieRange) > 0) {
          parsedParams.maxCalories = Number(calorieRange);
        }
        // 기존 문자열 패턴 지원 (하위 호환성)
        else if (calorieRange === "0-300") {
          parsedParams.maxCalories = 300;
        } else if (calorieRange === "300-500") {
          parsedParams.minCalories = 300;
          parsedParams.maxCalories = 500;
        } else if (calorieRange === "500-800") {
          parsedParams.minCalories = 500;
          parsedParams.maxCalories = 800;
        } else if (calorieRange === "800+") {
          parsedParams.minCalories = 800;
        }
      }
      
      // Parse protein ranges (슬라이더 값 직접 처리)
      if (req.query.proteinRange) {
        const proteinRange = req.query.proteinRange as string;
        // 숫자로 직접 전달되는 경우 (슬라이더에서 직접 설정한 값)
        if (!isNaN(Number(proteinRange)) && Number(proteinRange) > 0) {
          parsedParams.maxProtein = Number(proteinRange);
        }
        // 기존 문자열 패턴 지원 (하위 호환성)
        else if (proteinRange === "0-10") {
          parsedParams.maxProtein = 10;
        } else if (proteinRange === "10-20") {
          parsedParams.minProtein = 10;
          parsedParams.maxProtein = 20;
        } else if (proteinRange === "20-30") {
          parsedParams.minProtein = 20;
          parsedParams.maxProtein = 30;
        } else if (proteinRange === "30+") {
          parsedParams.minProtein = 30;
        }
      }
      
      // Parse carbs ranges (슬라이더 값 직접 처리)
      if (req.query.carbsRange) {
        const carbsRange = req.query.carbsRange as string;
        // 숫자로 직접 전달되는 경우 (슬라이더에서 직접 설정한 값)
        if (!isNaN(Number(carbsRange)) && Number(carbsRange) > 0) {
          parsedParams.maxCarbs = Number(carbsRange);
        }
        // 기존 문자열 패턴 지원 (하위 호환성)
        else if (carbsRange === "0-30") {
          parsedParams.maxCarbs = 30;
        } else if (carbsRange === "30-60") {
          parsedParams.minCarbs = 30;
          parsedParams.maxCarbs = 60;
        } else if (carbsRange === "60-90") {
          parsedParams.minCarbs = 60;
          parsedParams.maxCarbs = 90;
        } else if (carbsRange === "90+") {
          parsedParams.minCarbs = 90;
        }
      }
      
      // Parse fat ranges (슬라이더 값 직접 처리)
      if (req.query.fatRange) {
        const fatRange = req.query.fatRange as string;
        // 숫자로 직접 전달되는 경우 (슬라이더에서 직접 설정한 값)
        if (!isNaN(Number(fatRange)) && Number(fatRange) > 0) {
          parsedParams.maxFat = Number(fatRange);
        }
        // 기존 문자열 패턴 지원 (하위 호환성)
        else if (fatRange === "0-10") {
          parsedParams.maxFat = 10;
        } else if (fatRange === "10-20") {
          parsedParams.minFat = 10;
          parsedParams.maxFat = 20;
        } else if (fatRange === "20-30") {
          parsedParams.minFat = 20;
          parsedParams.maxFat = 30;
        } else if (fatRange === "30+") {
          parsedParams.minFat = 30;
        }
      }
      
      // Perform search
      const products = await storage.searchProducts(parsedParams);
      
      // Return search results
      res.json(products);
    } catch (error) {
      console.error("Search failed:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
