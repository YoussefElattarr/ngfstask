const express = require("express");

const Product = require("../models/Products");

const productRoutes = express.Router();

// Create a product
productRoutes.post('/', async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ errors: messages });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Get all Products with search, sort, and pagination
  productRoutes.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, sort = 'productName', productName = '', category = '', priceRange = '', dateRange = '' } = req.query;
  
      // Validate sort field
      const validSortFields = ['productName', 'price'];
      if (!validSortFields.includes(sort)) {
        return res.status(400).json({ error: 'Invalid sort field' });
      }
  
      // Initialize an empty query to be included in Find()
      const query = {};

      // If user included product name in the search
      if (productName) {
        query.productName = new RegExp(productName, 'i');
      }
     
      // If user included category in the search
      if (category) {
        query.category = new RegExp(category, 'i');
      }
  
      // If user included price range in the search
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split(':').map(Number);
        if (isNaN(minPrice) || isNaN(maxPrice)) {
          return res.status(400).json({ error: 'Invalid price range format' });
        }
        query.price = { $gte: minPrice, $lte: maxPrice };
      }
  
      // If user included date range in the search
      if (dateRange) {
        const [startDate, endDate] = dateRange.split(':').map(date => new Date(date));
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return res.status(400).json({ error: 'Invalid date range format' });
        }
        query.availabilityDate = { $gte: startDate, $lte: endDate };
      }
      
      const products = await Product.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      const totalProducts = await Product.countDocuments(query);
  
      res.json({
        total: totalProducts,
        page: Number(page),
        limit: Number(limit),
        products
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Get a Product by ID
productRoutes.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Update a Product by ID
productRoutes.put('/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ errors: messages });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a Product by ID
  productRoutes.delete('/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = productRoutes;