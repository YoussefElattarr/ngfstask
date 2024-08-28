import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  Button,
  Container,
  Box,
  Slider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Product } from "../models/Product";
import { getProducts, deleteProduct } from "../services/api";
import categories from "../predefinedData/categories";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderBy, setOrderBy] = useState<string>("productName"); // Default sorting by productName
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  //   const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [productName, setProductName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10); // Default limit is 10
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [orderBy, sortDirection, page, limit]);

  const fetchProducts = async () => {
    const queryParams = new URLSearchParams();
    // Pagination parameters
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    // Sorting parameters
    queryParams.append("sort", orderBy);
    //queryParams.append('sortDirection', sortDirection);

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
      queryParams.append("dateRange", `${startDate || ""}:${endDate || ""}`);
    }

    const queryString = queryParams.toString();
    console.log(queryString.replace(/%3A/g, ":"));
    try {
      const response = await getProducts(queryString.replace(/%3A/g, ":"));
      setProducts(response.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleRequestSort = (property: string) => {
    // Set sorting direction based on the selected property
    const isAscending = orderBy === property && sortDirection === "asc";
    setSortDirection(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  //   const handlePriceChange = (event: Event, newValue: number | number[]) => {
  //     setPriceRange(newValue as number[]);
  //   };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value as string);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as string;
    setLimit(parseInt(value)); // Ensure value is parsed correctly as a number
  };

  // Handle edit button click
  const handleEdit = (productId: any) => {
    navigate(`/edit/${productId}`);
  };

  // Handle delete button click
  const handleDelete = async (productId: any) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  //   const handleLimitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //     setLimit(event.target.value as number);
  //   };
  return (
    // <Container>
    <div>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Product Filter</Typography>
        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          displayEmpty={true}
          onChange={handleCategoryChange}
          label="Category"
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
        {/* <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        /> */}
        <TextField
          label="Min Price"
          type="number"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(e.target.value ? Number(e.target.value) : "")
          }
          sx={{ mb: 2, mr: 2 }}
        />
        <TextField
          label="Max Price"
          type="number"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : "")
          }
          sx={{ mb: 2, mr: 2 }}
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate ? startDate : new Date()}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ mb: 2, mr: 2 }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate ? endDate : new Date()}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ mb: 2 }}
        />
        <div>
          {/* <Typography gutterBottom>Price Range</Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={10000}
        step={50}
      />
      <div>
        <Typography>
          Price: {priceRange[0]} - {priceRange[1]}
        </Typography>
      </div> */}
          <Button
            variant="contained"
            color="primary"
            onClick={fetchProducts}
            style={{ marginTop: "10px" }}
          >
            Search
          </Button>
        </div>
      </Box>
      {/* Pagination Controls */}
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <FormControl style={{ minWidth: 120, marginRight: "10px" }}>
          <InputLabel>Items per page</InputLabel>
          <Select value={limit} onChange={handleLimitChange}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={{ marginRight: "10px" }}
          >
            Previous
          </Button>
          <Typography variant="body1">Page {page}</Typography>
          <Button
            variant="outlined"
            onClick={() => handlePageChange(page + 1)}
            style={{ marginLeft: "10px" }}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Product List */}
      <div>
        <Typography variant="h6">Product List</Typography>
        {products.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "productName"}
                      //   direction={orderBy === 'productName' ? sortDirection : 'asc'}
                      onClick={() => handleRequestSort("productName")}
                    >
                      Product Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "price"}
                      //   direction={orderBy === 'price' ? sortDirection : 'asc'}
                      onClick={() => handleRequestSort("price")}
                    >
                      Price
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Availability Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {new Date(product.availabilityDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(product._id)}
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No products found</Typography>
        )}
      </div>
    </div>
  );
  //       <TableContainer component={Paper}>
  //         <Table>
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>
  //                 <TableSortLabel
  //                   active={orderBy === 'productName'}
  //                   direction={orderBy === 'productName' ? sortDirection : 'asc'}
  //                   onClick={() => handleRequestSort('productName')}
  //                 >
  //                   Product Name
  //                 </TableSortLabel>
  //               </TableCell>
  //               <TableCell>
  //                 <TableSortLabel
  //                   active={orderBy === 'price'}
  //                   direction={orderBy === 'price' ? sortDirection : 'asc'}
  //                   onClick={() => handleRequestSort('price')}
  //                 >
  //                   Price
  //                 </TableSortLabel>
  //               </TableCell>
  //               <TableCell>Category</TableCell>
  //               <TableCell>Availability Date</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {products.map((product) => (
  //               <TableRow key={product._id}>
  //                 <TableCell>{product.productName}</TableCell>
  //                 <TableCell>{product.price}</TableCell>
  //                 <TableCell>{product.category}</TableCell>
  //                 <TableCell>{new Date(product.availabilityDate).toLocaleDateString()}</TableCell>
  //               </TableRow>
  //             ))}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  // </Container>
};

export default ProductList;
