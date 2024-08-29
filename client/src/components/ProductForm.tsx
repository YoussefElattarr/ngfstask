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
  Alert,
  Snackbar,
  FormControl,
} from "@mui/material";
import { Product } from "../models/Product";
// Get methods from the serveices api
import { createProduct, updateProduct, getProduct } from "../services/api";
// Getting the predefined Categories
import categories from "../predefinedData/categories";

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    _id: "",
    productName: "",
    category: "",
    price: 0,
    availabilityDate: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false); // Is the user editing or adding?
  const [openAlert, setOpenAlert] = useState<boolean>(false); // State for alert
  const [successAlert, setsuccessAlert] = useState<boolean>(true); // Is alert success?
  const [alertMessage, setAlertMessage] = useState<string>("");
  const navigate = useNavigate();
  // Get id of the product if editing
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // If editing, fetch product by id
    if (id) {
      getProductToBeEdited(id);
    }
  }, [id]);

  // Method to get the product
  const getProductToBeEdited = async (id: string) => {
    const response = await getProduct(id);
    setProduct({
      productName: response.productName,
      category: response.category,
      price: response.price,
      availabilityDate: response.availabilityDate,
    });
    setIsEditing(true); // Set editing to true
  };

  // Handle change in fields
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default submitting
    // If editing
    if (isEditing) {
      console.log(product);
      try {
        const response = await updateProduct(`${id}`, product);
        // Activate alert
        setOpenAlert(true);
        // Success alert
        setsuccessAlert(true);
        setAlertMessage("Product updated successfully.");
        // Wait 3 seconds before redirecting to home
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        // Activate alert
        setOpenAlert(true);
        // Fail alert
        setsuccessAlert(false);
        setAlertMessage(`Error updating product:${error}`);
      }
    }
    // If creating
    else {
      try {
        const response = await createProduct(product);
        // Activate alert
        setOpenAlert(true);
        // Success alert
        setsuccessAlert(true);
        setAlertMessage("Product created successfully.");
        // Wait 3 seconds before redirecting to home
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        // Activate alert
        setOpenAlert(true);
        // Fail alert
        setsuccessAlert(false);
        setAlertMessage(`Error creating product:${error}`);
      }
    }
  };

  // Handle category change
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: event.target.value,
    }));
  };

  return (
    <Container>
      {/* Snackbar to display alert, it lasts 3 secs */}
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
      >
        <Alert
          onClose={() => setOpenAlert(false)}
          severity={successAlert ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        {isEditing ? "Edit Product" : "Add Product"}
      </Typography>
      {/* Form for editing and creating a product */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {false &&<InputLabel htmlFor="productName">Product Name</InputLabel>}
        <TextField
          label="Product Name"
          name="productName"
          id="productName"
          value={product.productName}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          slotProps={{ htmlInput: { minLength: 3, maxLength: 100 } }}
        />
        {/* Category is a select field using the predefined categories */}
        <FormControl fullWidth aria-label="Category" id="category">
          <InputLabel htmlFor="category">Category</InputLabel>
          <Select
            required
            fullWidth
            name="category"
            id="category"
            label="Category"
            labelId="category"
            // native={true}
            value={product.category}
            sx={{ mb: 2 }}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
       { false &&<InputLabel htmlFor="price">Price</InputLabel>}
        <TextField
          label="Price"
          type="number"
          name="price"
          id="price"
          data-testid="price"
          value={product.price}
          // If the value is not set, default to empty
          defaultValue={product.price ? product.price : ""}
          onChange={handleChange}
          fullWidth
          required
          slotProps={{ htmlInput: { min: 0 } }}
          sx={{ mb: 2 }}
        />
        {false && <InputLabel htmlFor="availabilityDate">Availability Date</InputLabel>}
        <TextField
          label="Availability Date"
          type="date"
          name="availabilityDate"
          id="availabilityDate"
          data-testid="availabilityDate"
          // If the value is not set, default to current date
          value={
            product.availabilityDate
              ? new Date(product.availabilityDate).toISOString().split("T")[0]
              : new Date()
          }
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {/* If editing, label it update, else add */}
          {isEditing ? "Update" : "Add"}
        </Button>
      </Box>
    </Container>
  );
};

export default ProductForm;
