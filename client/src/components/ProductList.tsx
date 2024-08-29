import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Product } from "../models/Product";
// Get methods from the serveices api
import { getProducts, deleteProduct } from "../services/api";
// Getting the predefined Categories
import categories from "../predefinedData/categories";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderBy, setOrderBy] = useState<string>("productName"); // Default sorting by productName
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(0); // 0-based page for TablePagination
  const [limit, setLimit] = useState<number>(10); // Default limit is 10
  const [totalProducts, setTotalProducts] = useState<number>(0); // Default total products is 0
  const [openAlert, setOpenAlert] = useState<boolean>(false); // State for alert
  const [successAlert, setsuccessAlert] = useState<boolean>(true); // Is alert success?
  const [alertMessage, setAlertMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [orderBy, page, limit]);

  // Clear all filters fields
  const clearFilters = async () => {
    setCategory("");
    setProductName("");
    setMinPrice("");
    setMaxPrice("");
    setStartDate("");
    setEndDate("");
  };

  // Fetch products while considering the filters
  const fetchProducts = async () => {
    // Create a query params string
    const queryParams = new URLSearchParams();
    // Pagination parameters
    queryParams.append("page", (page + 1).toString());
    queryParams.append("limit", limit.toString());

    // Sorting parameters
    queryParams.append("sort", orderBy);

    // Search parameters
    if (productName) {
      queryParams.append("productName", productName);
    }

    if (category) {
      queryParams.append("category", category);
    }

    // Price range parameter
    if (minPrice !== "" && maxPrice !== "") {
      queryParams.append("priceRange", `${minPrice}:${maxPrice}`);
    }

    // Date range parameter
    if (startDate && endDate) {
      console.log("here");
      queryParams.append("dateRange", `${startDate || ""}:${endDate || ""}`);
    }

    const queryString = queryParams.toString();

    try {
      // Use replace %3A to get the ':' character
      const response = await getProducts(queryString.replace(/%3A/g, ":"));
      // Set the products
      setProducts(response.products);
      // Set the total number of products
      setTotalProducts(response.total);
      // Activate alert
      setOpenAlert(true);
      // Success alert
      setsuccessAlert(true);
      setAlertMessage("Fetched products successfully.");
    } catch (error) {
      console.error("Error fetching products:", error);
      // Activate alert
      setOpenAlert(true);
      // Fail alert
      setsuccessAlert(false);
      setAlertMessage(`Error fetching products:${error}`);
    }
  };

  // Change page
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Change limit
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing items per page
  };

  // Change category
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value as string);
  };

  // Handle edit button click
  const handleEdit = (productId: any) => {
    navigate(`/edit/${productId}`);
  };

  // Handle delete button click
  const handleDelete = async (productId: any) => {
    try {
      await deleteProduct(productId);
      // Remove product from the list
      setProducts(products.filter((product) => product._id !== productId));
      // Activate alert
      setOpenAlert(true);
      // Success alert
      setsuccessAlert(true);
      setAlertMessage("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      // Activate alert
      setOpenAlert(true);
      // Fail alert
      setsuccessAlert(false);
      setAlertMessage(`Error deleting products:${error}`);
    }
  };

  return (
    <div>
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
      {/* Box containing filters */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Product Filter
        </Typography>
        {/* Grid to contain the filters */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {/* Category is a select field using the predefined categories */}
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                fullWidth
                label="Category"
                labelId="category-label"
                value={category}
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Min Price"
              type="number"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : "")
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Max Price"
              type="number"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : "")
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              // If the value is not set, default to current date
              value={startDate ? startDate : new Date()}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              // If the value is not set, default to current date
              value={endDate ? endDate : new Date()}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          {/* Two buttons to search and clear filters */}
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={fetchProducts}
            >
              Search
            </Button>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* Product List in a table */}
      <div>
        <Typography variant="h6">Product List</Typography>
        {/* Condition on the length of the list, if not empty display*/}
        {products.length > 0 ? (
          <Paper sx={{ width: "100%", mb: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                {/* Table header */}
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {/* Sort column */}
                      <TableSortLabel
                        active={orderBy === "productName"}
                        onClick={() => setOrderBy("productName")}
                      >
                        Product Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                       {/* Sort column */}
                      <TableSortLabel
                        active={orderBy === "price"}
                        onClick={() => setOrderBy("price")}
                      >
                        Price
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Availability Date</TableCell>
                  </TableRow>
                </TableHead>
                {/* Table body */}
                <TableBody>
                  {/* Map products to rows */}
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {new Date(
                          product.availabilityDate
                        ).toLocaleDateString()}
                      </TableCell>
                      {/* A cell to contain an update and a delete button */}
                      <TableCell>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            gap: 2, // Space between buttons
                            flexWrap: "wrap", // Ensures buttons wrap on smaller screens
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(product._id)}
                            sx={{
                              padding: "8px 16px", // Adds padding for more clickable space
                              fontSize: "0.875rem", // Slightly smaller font for compactness
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(product._id)}
                            sx={{
                              padding: "8px 16px",
                              fontSize: "0.875rem",
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Pagination for the table */}
              <TablePagination
                component="div"
                count={totalProducts} // You can use the total number of products from API response
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={limit}
                onRowsPerPageChange={handleLimitChange}
                rowsPerPageOptions={[5, 10, 20, 50]}
              />
            </TableContainer>
          </Paper>
        ) : (
          // If no products
          <Typography>No products found</Typography>
        )}
      </div>
    </div>
  );
};

export default ProductList;
