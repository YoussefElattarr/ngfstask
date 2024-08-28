import axios from "axios";

const API_URL = "http://localhost:3000/product";

// export const getProducts = async (params: any) => {
//   const response = await axios.get(API_URL, { params });
//   return response.data;
// };

export const getProducts = async (queryParams: any) => {
  try {
    const response = await axios.get(API_URL + `?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Handle the error here (e.g., display an error message to the user)
    throw error; // Re-throw the error for handling in useEffect
  }
};

export const getProduct = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Handle the error here (e.g., display an error message to the user)
    throw error; // Re-throw the error for handling in useEffect
  }
};

export const createProduct = async (product: any) => {
  try {
    const response = await axios.post(API_URL, product);
    return response.data;
  } catch (error) {
    {
      console.error("Error creating the product:", error);
      // Handle the error here (e.g., display an error message to the user)
      throw error; // Re-throw the error for handling in useEffect
    }
  }
};

export const updateProduct = async (id: string, product: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, product);
    return response.data;
  } catch (error) {
    console.error("Error creating the product:", error);
    // Handle the error here (e.g., display an error message to the user)
    throw error; // Re-throw the error for handling in useEffect
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting the product:", error);
    // Handle the error here (e.g., display an error message to the user)
    throw error; // Re-throw the error for handling in useEffect
  }
};
