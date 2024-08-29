// ProductList.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductList from "../components/ProductList";
import { getProducts, deleteProduct } from "../services/api";
import { useNavigate } from "react-router-dom";

// Mock the API functions
jest.mock("../services/api");

// Mocking useNavigate from react-router-dom
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Keep the original implementations
    useNavigate: () => mockedNavigate // Mock useNavigate
  }));

describe("ProductList Component", () => {
  const mockProducts = [
    {
      _id: "1",
      productName: "Product A",
      price: 100,
      category: "Electronics",
      availabilityDate: "2023-08-01",
    },
    {
      _id: "2",
      productName: "Product B",
      price: 200,
      category: "Books",
      availabilityDate: "2023-08-02",
    },
  ];

  beforeEach(() => {
    // Mock the getProducts API call to return mock products
    (getProducts as jest.Mock).mockResolvedValue({
      products: mockProducts,
      total: 2,
    });
  });

  test("renders product list correctly", async () => {
    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    // Wait for the API to resolve and products to be displayed
    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
    });
  });

  test("deletes a product", async () => {
    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    // Wait for the product list to render
    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });

    // Mock the deleteProduct API
    (deleteProduct as jest.Mock).mockResolvedValue({});

    // Click delete button for the first product
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    // Ensure the product is deleted
    await waitFor(() => {
      expect(screen.queryByText("Product A")).not.toBeInTheDocument();
    });
  });

  test("renders no products message when no products found", async () => {
    // Mock the getProducts API to return an empty list
    (getProducts as jest.Mock).mockResolvedValue({ products: [], total: 0 });

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    // Wait for the "No products found" message
    await waitFor(() => {
      expect(screen.getByText("No products found")).toBeInTheDocument();
    });
  });

  test("edit button takes you to edit page", async () => {
    // const mockNavigate = useNavigate as jest.Mock;

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    // Wait for the product list to render
    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });

    // Click edit button for the first product
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    // Assert that useNavigate was called with the expected path
    expect(mockedNavigate).toHaveBeenCalledWith("/edit/1");
  });

//   test("add product button takes you to add page", async () => {
//     // const mockNavigate = useNavigate as jest.Mock;

//     render(
//       <BrowserRouter>
//         <ProductList />
//       </BrowserRouter>
//     );

//     // Click Add Product button from Appbar
//     const addButton = screen.getByText("Add Product");
//     fireEvent.click(addButton);

//     // Assert that useNavigate was called with the expected path
//     expect(mockedNavigate).toHaveBeenCalledWith("/add");
//   });

  test("renders no products message when no products found", async () => {
    // Mock the getProducts API to return an empty list
    (getProducts as jest.Mock).mockResolvedValue({ products: [], total: 0 });

    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    // Wait for the "No products found" message
    await waitFor(() => {
      expect(screen.getByText("No products found")).toBeInTheDocument();
    });
  });
});
