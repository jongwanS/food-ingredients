// Products API handler for Vercel serverless functions
import { getProduct, redirectToClient } from './data-loader.js';

export default function handler(req, res) {
  // Check if it's a non-API request
  if (!req.url.startsWith('/api/')) {
    return redirectToClient(res);
  }
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight CORS)
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }
  
  try {
    // Extract ID from path
    const idMatch = req.url.match(/\/products\/(\d+)/);
    if (!idMatch) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Invalid product ID' }));
    }
    
    const id = parseInt(idMatch[1]);
    const product = getProduct(id);
    
    if (!product) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Product not found' }));
    }
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(product));
  } catch (error) {
    console.error('Error handling product request:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}