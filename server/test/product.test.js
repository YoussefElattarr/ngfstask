const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server"); // Adjust the path to your server
const Product = require("../models/Products"); // Adjust the path to your Product model
require("dotenv").config({ path: "../.env" });

const request = supertest(app);

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(process.env.MONGODB_URI);
});

beforeEach(async () => {
  // Clear the Product collection before each test
  await Product.deleteMany({});
});

afterAll(async () => {
  // Close the database connection and server after all tests
  await mongoose.connection.close();
  app.close();
});

describe("Product API", () => {
  // Test POST /product
  describe("POST /product", () => {
    // Test a succesfull create
    it("should create a product with a valid availability date", async () => {
      const product = {
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: "2025-09-10",
      };

      const res = await request.post("/product").send(product);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.productName).toBe("Smartphone");
      expect(res.body.category).toBe("Electronics");
      expect(res.body.price).toBe(699.99);
      expect(
        new Date(res.body.availabilityDate).toISOString().split("T")[0]
      ).toBe("2025-09-10");
    });

    // Test post request with an invalid date
    it("should return an error for invalid availability date", async () => {
      const product = {
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: "invalid-date",
      };

      const res = await request.post("/product").send(product);

      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toBe(
        'Cast to date failed for value "invalid-date" (type string) at path "availabilityDate"'
      );
    });

    // Test a post request with an old date
    it("should return an error if availability date is in the past", async () => {
      const product = {
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: "2022-01-01",
      };

      const res = await request.post("/product").send(product);

      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toBe(
        "Availability date must be today or in the future"
      );
    });

    // Test a post request with an invalid category not in the predefined list
    it("should return an error for an invalid category", async () => {
      const product = {
        productName: "Smartphone",
        category: "InvalidCategory",
        price: 699.99,
        availabilityDate: "2025-09-10",
      };

      const res = await request.post("/product").send(product);

      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toBe(
        "InvalidCategory is not a valid category"
      );
    });

    // Test a post request with a short name
    it("should return an error if product name is too short", async () => {
      const product = {
        productName: "Sm",
        category: "Electronics",
        price: 699.99,
        availabilityDate: "2025-09-10",
      };

      const res = await request.post("/product").send(product);

      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toBe(
        "Product name must be at least 3 characters long"
      );
    });

    // Test a post request without price
    it("should return an error if price is missing", async () => {
      const product = {
        productName: "Smartphone",
        category: "Electronics",
        availabilityDate: "2025-09-10",
      };

      const res = await request.post("/product").send(product);

      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toBe("Price is required");
    });
  });

  // Test GET /product
  describe("GET /product", () => {
    // Sucessfully get available product
    it("should retrieve all product", async () => {
      const product = new Product({
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: new Date("2025-09-10"),
      });
      await product.save();

      const res = await request.get("/product");

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.products[0]).toHaveProperty("productName", "Smartphone");
    });

    // Successfully search for a post by name
    it("should search product by name", async () => {
      const product = new Product({
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: new Date("2025-09-10"),
      });
      await product.save();

      const res = await request
        .get("/product")
        .query({ productName: "Smartphone" });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.products[0]).toHaveProperty("productName", "Smartphone");
    });

    // Sucessfully search product by category
    it("should search product by category", async () => {
      const product = new Product({
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: new Date("2025-09-10"),
      });
      await product.save();

      const res = await request
        .get("/product")
        .query({ category: "Electronics" });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.products[0]).toHaveProperty("category", "Electronics");
    });

    // Successfully search product withing price range
    it("should search product by price range", async () => {
      const product = new Product({
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: new Date("2025-09-10"),
      });
      await product.save();

      const res = await request
        .get("/product")
        .query({ minPrice: 500, maxPrice: 800 });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.products[0].price).toBeGreaterThanOrEqual(500);
      expect(res.body.products[0].price).toBeLessThanOrEqual(800);
    });

    // Successfully search product within date range
    it("should search product by availability date range", async () => {
      const product = new Product({
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: new Date("2025-09-10"),
      });
      await product.save();

      const res = await request
        .get("/product")
        .query({ startDate: "2025-09-01", endDate: "2025-09-15" });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      const availabilityDate = new Date(res.body.products[0].availabilityDate);
      expect(availabilityDate.getTime()).toBeGreaterThanOrEqual(
        new Date("2025-09-01").getTime()
      );
      expect(availabilityDate.getTime()).toBeLessThanOrEqual(
        new Date("2025-09-15").getTime()
      );
    });
  });

  // Test GET /product/:id
  describe("GET /product/:id", () => {
    // Successfully get product by ID
    it("should retrieve a product by ID", async () => {
      const product = new Product({
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: new Date("2025-09-10"),
      });
      await product.save();

      const res = await request.get(`/product/${product._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("productName", "Smartphone");
    });

    // Get a product using an invalid ID
    it("should return 500 for an invalid product ID", async () => {
      const res = await request.get("/product/invalidid");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe(
        'Cast to ObjectId failed for value "invalidid" (type string) at path "_id" for model "Product"'
      );
    });
  });

  // Test PUT /product/:id
  describe("PUT /product/:id", () => {
    // Successfully update a product by ID
    it("should update a product by ID", async () => {
      const product = new Product({
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: new Date("2025-09-10"),
      });
      await product.save();

      const updatedProduct = {
        productName: "Smartphone Pro",
        category: "Electronics",
        price: 799.99,
        availabilityDate: "2025-10-10",
      };

      const res = await request
        .put(`/product/${product._id}`)
        .send(updatedProduct);

      expect(res.status).toBe(200);
      expect(res.body.productName).toBe("Smartphone Pro");
      expect(res.body.price).toBe(799.99);
      expect(
        new Date(res.body.availabilityDate).toISOString().split("T")[0]
      ).toBe("2025-10-10");
    });

    // Update product using invalid PUT body
    it("should return 400 for an invalid PUT body", async () => {
      const product = new Product({
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: new Date("2025-09-10"),
      });
      await product.save();

      const updatedProduct = {
        productName: "Smartphone Pro",
        category: "Invalid Category",
        price: 799.99,
        availabilityDate: "2025-10-10",
      };

      const res = await request
        .put(`/product/${product._id}`)
        .send(updatedProduct);

      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toBe(
        "Invalid Category is not a valid category"
      );
    });

    // Update product using invalid ID
    it("should return 500 for an invalid product ID", async () => {
      const updatedProduct = {
        productName: "Smartphone Pro",
        category: "Electronics",
        price: 799.99,
        availabilityDate: "2025-10-10",
      };

      const res = await request.put("/product/invalidid").send(updatedProduct);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe(
        'Cast to ObjectId failed for value "invalidid" (type string) at path "_id" for model "Product"'
      );
    });
  });

  // Test DELETE /product/:id
  describe("DELETE /product/:id", () => {
    // Successfully delete a product
    it("should delete a product by ID", async () => {
      const product = new Product({
        productName: "Smartphone",
        category: "Electronics",
        price: 699.99,
        availabilityDate: new Date("2025-09-10"),
      });
      await product.save();

      const res = await request.delete(`/product/${product._id}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Product deleted successfully");
    });

    // Delete a product using an invalid ID
    it("should return 500 for an invalid product ID", async () => {
      const res = await request.delete("/product/invalidid");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe(
        'Cast to ObjectId failed for value "invalidid" (type string) at path "_id" for model "Product"'
      );
    });
  });
});
