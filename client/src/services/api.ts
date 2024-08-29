import axios from "axios";

// url to the backend
const API_URL = "http://localhost:3001/product";

// Get the products with filters
export const getProducts = async (queryParams: any) => {
  try {
    const response = await axios.get(API_URL + `?${queryParams}`);
    if (response.status === 200) return response.data;
    else throw new Error(`Error fetching products: ${response.data.error})`);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get a single product
export const getProduct = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    if (response.status === 200) return response.data;
    else throw new Error(`Error fetching products: ${response.data.error})`);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Create a product
export const createProduct = async (product: any) => {
  try {
    const response = await axios.post(API_URL, product);
    if (response.status === 201) return response.data;
    else
      throw new Error(
        `Error fetching products: ${
          response.data.errors ? response.data.errors : response.data.error
        })`
      );
  } catch (error) {
    {
      console.error("Error creating the product:", error);
      throw error;
    }
  }
};

// Update a product
export const updateProduct = async (id: string, product: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, product);
    if (response.status === 200) return response.data;
    else
      throw new Error(
        `Error fetching products: ${
          response.data.errors ? response.data.errors : response.data.error
        })`
      );
  } catch (error) {
    console.error("Error creating the product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    if (response.status === 200) return response.data;
    else throw new Error(`Error fetching products: ${response.data.error})`);
  } catch (error) {
    console.error("Error deleting the product:", error);
    throw error;
  }
};
