// Vercel serverless function
import { 
  getCategories, 
  getFranchises, 
  getFranchisesByCategory,
  getCategory,
  getFranchise,
  getProduct,
  redirectToClient
} from './data-loader.js';

export default function handler(req, res) {
  // Parse the URL path
  const path = req.url.replace(/^\/api/, '');
  
  // For non-API requests, redirect to the frontend
  if (!req.url.startsWith('/api/')) {
    return redirectToClient(res);
  }
  
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Return API response for API requests
  if (path.startsWith('/categories')) {
    try {
      // Check if specific category ID is requested
      const idMatch = path.match(/\/categories\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const category = getCategory(id);
        if (!category) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Category not found' }));
        }
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(category));
      }
      
      // Return all categories
      const categories = getCategories();
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(categories));
    } catch (err) {
      console.error('Error handling categories:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  } 
  else if (path.startsWith('/franchises')) {
    try {
      // Check if specific franchise ID is requested
      const idMatch = path.match(/\/franchises\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const franchise = getFranchise(id);
        if (!franchise) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Franchise not found' }));
        }
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(franchise));
      }
      
      // Check if filtering by category
      const categoryMatch = path.match(/\/franchises\?categoryId=(\d+)/);
      if (categoryMatch) {
        const categoryId = parseInt(categoryMatch[1]);
        const franchises = getFranchisesByCategory(categoryId);
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(franchises));
      }
      
      // Return all franchises
      const franchises = getFranchises();
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(franchises));
    } catch (err) {
      console.error('Error handling franchises:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  } 
  else if (path.match(/\/products\/\d+/)) {
    try {
      // Handle product by ID
      const id = parseInt(path.split('/').pop());
      const product = getProduct(id);
      if (!product) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Product not found' }));
      }
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(product));
    } catch (err) {
      console.error('Error loading product:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  } 
  else {
    // For unhandled API routes
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Not Found' }));
  }
}