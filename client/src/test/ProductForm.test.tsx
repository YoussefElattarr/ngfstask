// ProductForm.test.tsx
import React, { act } from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { BrowserRouter, Route, Routes, MemoryRouter } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct, updateProduct, getProduct } from "../services/api";
// Mock the API functions
jest.mock("../services/api");

describe("ProductForm Component", () => {
  test("renders add product form correctly", async () => {
    await act(async () =>
      render(
        <BrowserRouter>
          <ProductForm />
        </BrowserRouter>
      )
    );

    // Assert form fields are present
    await act(async () => {
      expect(screen.getByText("Product Name")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Price")).toBeInTheDocument();
      expect(screen.getByText("Availability Date")).toBeInTheDocument();
    });
  });

  test("creates a product", async () => {
    // Mock the createProduct API
    (createProduct as jest.Mock).mockResolvedValue({});

    await act(() => {
      render(
        <BrowserRouter>
          <ProductForm />
        </BrowserRouter>
      );
    });

    // Fill the form and submit
      fireEvent.change(screen.getByLabelText(/Product Name/i), {
        target: { value: "New Product" },
      });
      fireEvent.mouseDown(screen.getByRole("combobox", { name: /Category/i }));
      fireEvent.click(within(screen.getByRole("listbox")).getByText("Home"));

      fireEvent.change(screen.getByLabelText(/Price/i), {
        target: { value: "Books" },
      });
      fireEvent.change(screen.getByLabelText(/Availability Date/i), {
        target: { value: new Date("2025-10-01") },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add" }));

    // Assert API call
    await waitFor(() => {
      expect(createProduct).toHaveBeenCalled();
    });
  });

  test("renders edit product form correctly", async () => {
    const mockProduct = {
      _id: "1",
      productName: "Product A",
      category: "Books",
      price: 100,
      availabilityDate: "2025-08-01",
    };

    // Mock the getProduct API to return a product
    (getProduct as jest.Mock).mockResolvedValue(mockProduct);

    await act(() => {
      render(
        <MemoryRouter initialEntries={[`/edit/${mockProduct._id}`]}>
          <Routes>
            <Route path="/edit/:id" element={<ProductForm />} />
          </Routes>
        </MemoryRouter>
      );
    });

    //await new Promise((resolve) => setTimeout(resolve, 1000));
    // Wait for the API to resolve and product details to be filled
    await waitFor(() => {
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue("Product A");
      expect(screen.getByLabelText(/Price/i)).toHaveValue(100);
    });
  });

  test("updates a product", async () => {
    const mockProduct = {
      _id: "1",
      productName: "Product A",
      category: "Books",
      price: 100,
      availabilityDate: "2025-08-01",
    };

    // Mock the getProduct and updateProduct API
    (getProduct as jest.Mock).mockResolvedValue(mockProduct);
    (updateProduct as jest.Mock).mockResolvedValue({});

    await act(() => {
      render(
        <MemoryRouter initialEntries={[`/edit/${mockProduct._id}`]}>
          <Routes>
            <Route path="/edit/:id" element={<ProductForm />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Wait for the product form to be filled with mock data
    await waitFor(() => {
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue("Product A");
    });

    // Change product name and submit
    await act(() => {
      fireEvent.change(screen.getByLabelText(/Product Name/i), {
        target: { value: "Updated Product" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Update" }));
    });

    // Assert API call
    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalled();
    });
  });
});
