const mongoose = require("mongoose");
// Import predefined categories
const categories = require("../../predefinedData/categories");

// Define the Product schema with validation rules
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Product name is required"],
    minlength: [3, "Product name must be at least 3 characters long"],
    maxlength: [100, "Product name must be less than 100 characters long"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: categories,
      message: "{VALUE} is not a valid category",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be at least 0"],
  },
  availabilityDate: {
    type: Date,
    required: [true, "Availability date is required"],
    validate: {
      validator: function (value) {
        return value >= new Date();
      },
      message: "Availability date must be today or in the future",
    },
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
