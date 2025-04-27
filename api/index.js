// Vercel serverless function
export default function handler(req, res) {
  // Parse the URL path
  const path = req.url.replace(/^\/api/, '');
  
  // For non-API requests, redirect to the frontend
  if (!req.url.startsWith('/api/')) {
    return res.writeHead(302, { Location: '/' }).end();
  }
  
  // Return API response for API requests
  if (path.startsWith('/categories')) {
    // Dynamically import data from our built server module
    import('../dist/server/data/data-loader.js').then(dataLoader => {
      const categories = dataLoader.getCategories();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(categories));
    }).catch(err => {
      console.error('Error loading categories:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    });
  } else if (path.startsWith('/franchises')) {
    // Handle franchises endpoint
    import('../dist/server/data/data-loader.js').then(dataLoader => {
      const franchises = dataLoader.getFranchises();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(franchises));
    }).catch(err => {
      console.error('Error loading franchises:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    });
  } else if (path.match(/\/products\/\d+/)) {
    // Handle product by ID
    const id = parseInt(path.split('/').pop());
    import('../dist/server/data/data-loader.js').then(dataLoader => {
      const product = dataLoader.getProductById(id);
      if (!product) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Product not found' }));
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(product));
    }).catch(err => {
      console.error('Error loading product:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    });
  } else {
    // For unhandled API routes
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}