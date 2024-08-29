const mongoose = require('mongoose');
const Product = require('../models/Products');
require("dotenv").config({path: "../.env"});

// Define a set of initial products
const initialProducts = [
  {
    productName: 'Laptop',
    category: 'Electronics',
    price: 999.99,
    availabilityDate: new Date('2024-10-01')
  },
  {
    productName: 'Smartphone',
    category: 'Electronics',
    price: 699.99,
    availabilityDate: new Date('2024-10-10')
  },
  {
    productName: 'Coffee Maker',
    category: 'Appliances',
    price: 89.99,
    availabilityDate: new Date('2024-10-15')
  },
  {
    productName: 'Desk Chair',
    category: 'Furniture',
    price: 149.99,
    availabilityDate: new Date('2024-10-20')
  },
  {
    productName: 'Headphones',
    category: 'Electronics',
    price: 199.99,
    availabilityDate: new Date('2024-11-01')
  },
  {
    productName: 'Blender',
    category: 'Appliances',
    price: 49.99,
    availabilityDate: new Date('2024-11-05')
  },
  {
    productName: 'Table Lamp',
    category: 'Furniture',
    price: 39.99,
    availabilityDate: new Date('2024-11-10')
  },
  {
    productName: '4K TV',
    category: 'Electronics',
    price: 1299.99,
    availabilityDate: new Date('2024-12-01')
  },
  {
    productName: 'Washing Machine',
    category: 'Appliances',
    price: 499.99,
    availabilityDate: new Date('2024-12-10')
  },
  {
    productName: 'Sofa',
    category: 'Furniture',
    price: 799.99,
    availabilityDate: new Date('2024-12-15')
  },
  {
    productName: 'Air Purifier',
    category: 'Appliances',
    price: 119.99,
    availabilityDate: new Date('2024-12-01')
  },
  {
    productName: 'Gaming Console',
    category: 'Electronics',
    price: 299.99,
    availabilityDate: new Date('2024-12-10')
  },
  {
    productName: 'Refrigerator',
    category: 'Appliances',
    price: 799.99,
    availabilityDate: new Date('2024-12-15')
  },
  {
    productName: 'Bookshelf',
    category: 'Furniture',
    price: 89.99,
    availabilityDate: new Date('2024-12-20')
  },
  {
    productName: 'Smartwatch',
    category: 'Electronics',
    price: 199.99,
    availabilityDate: new Date('2024-12-25')
  }
];

async function seedDatabase() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear the existing data
    await Product.deleteMany({});

    // Insert initial products
    await Product.insertMany(initialProducts);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

seedDatabase();
