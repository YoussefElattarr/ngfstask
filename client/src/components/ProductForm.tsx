import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Product } from "../models/Product";
import { createProduct, updateProduct, getProduct } from "../services/api";
import categories from "../predefinedData/categories";

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    productName: "",
    category: "",
    price: 0,
    availabilityDate: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      // Fetch the product data from API if editing
      //   fetch(`/api/products/${id}`)
      //     .then(response => response.json())
      //     .then(data => {
      //       setProduct({
      //         productName: data.productName,
      //         category: data.category,
      //         price: data.price,
      //         availabilityDate: data.availabilityDate,
      //       });
      //       setIsEditing(true);
      //     });

      getProductToBeEdited(id);
    }
  }, [id]);

  const getProductToBeEdited = async (id: string) => {
    const response = await getProduct(id);
    setProduct({
      productName: response.productName,
      category: response.category,
      price: response.price,
      availabilityDate: response.availabilityDate,
    });
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/products/${id}` : "/api/products";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save the product");
        }
        return response.json();
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: event.target.value,
    }));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? "Edit Product" : "Add Product"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="Product Name"
          name="productName"
          value={product.productName}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        {/* <TextField
          label="Category"
          name="category"
          value={product.category}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        /> */}
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={product.category}
          displayEmpty={true}
          onChange={handleCategoryChange}
          label="Category"
          fullWidth
          sx={{ mb: 2 }}
          renderValue={(value) => {
            return value ? value : "None";
          }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Price"
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Availability Date"
          type="date"
          name="availabilityDate"
          value={
            product.availabilityDate ? product.availabilityDate : new Date()
          }
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? "Update" : "Add"}
        </Button>
      </Box>
    </Container>
  );
};

export default ProductForm;
