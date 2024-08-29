// ProductForm.test.tsx
import React from "react";
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
import { useNavigate } from "react-router-dom";
// import  getProductToBeEdited  from "../components/ProductForm";
// Mock the API functions
jest.mock("../services/api");

// Mocking useNavigate from react-router-dom
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Keep the original implementations
  useNavigate: () => mockedNavigate, // Mock useNavigate
}));

describe("ProductForm Component", () => {
  test("renders add product form correctly", async () => {
    render(
      //   <BrowserRouter>
      //     <Routes>
      //       <Route path="/add" element={<ProductForm />} />
      //     </Routes>
      //   </BrowserRouter>
      <BrowserRouter>
        <ProductForm />
      </BrowserRouter>
    );

    // Assert form fields are present
    // expect(
    //   screen.getByRole("textbox", { name: "Product Name" })
    // ).toBeInTheDocument();
    // expect(screen.getByRole("menu", { name: "Category" })).toBeInTheDocument();
    // expect(screen.getByRole("textbox", { name: "Price" })).toBeInTheDocument();
    // expect(
    //   screen.getByRole("textbox", { name: "Availability Date" })
    // ).toBeInTheDocument();

    expect(screen.getByText("Product Name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Availability Date")).toBeInTheDocument();
  });

  test("creates a product", async () => {
    const mockNavigate = useNavigate as jest.Mock;

    // Mock the createProduct API
    (createProduct as jest.Mock).mockResolvedValue({});

    render(
      //   <BrowserRouter>
      //     <Routes>
      //       <Route path="/add" element={<ProductForm />} />
      //     </Routes>
      //   </BrowserRouter>
      <BrowserRouter>
        <ProductForm />
      </BrowserRouter>
    );

    // Fill the form and submit
    const productName = screen.getByText("Product Name").querySelector("input");
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "New Product" },
    });
    fireEvent.mouseDown(screen.getByRole("combobox", { name: /Category/i }));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("Home"));

    // fireEvent.change(screen.getByRole('combobox', { name: /Category/i }), {
    //   target: { value: "Category" },
    // });
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

    // Assert that useNavigate was called with the expected path
    // expect(mockedNavigate).toHaveBeenCalledWith("/");
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
    // jest
    //   .spyOn(ProductForm.WrappedComponent.prototype, "getProductToBeEdited")
    //   .mockImplementation(() => {
    //     return mockProduct;
    //   });
    render(
      //   <BrowserRouter>
      //     <Routes>
      //       <Route path="/edit/:id" id="1" element={<ProductForm />} />
      //     </Routes>
      //   </BrowserRouter>
      // <BrowserRouter>
      //   <Routes>
      //     <Route path={`/edit/${mockProduct._id}`} element={<ProductForm />} />
      //   </Routes>
      // </BrowserRouter>
      <BrowserRouter>
        <ProductForm/>
      </BrowserRouter>
      // <BrowserRouter>
      //   <Routes>
      //     <Route path="/edit/:id" element={<ProductForm />} />
      //   </Routes>
      // </BrowserRouter>
    );

    // // Mock the `useParams` hook to provide the product id
    // jest
    //   .spyOn(require("react-router"), "useParams")
    //   .mockReturnValue({ id: "1" });

    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Wait for the API to resolve and product details to be filled
    await waitFor(() => {
      expect(screen.getByLabelText(/Product Name/i)).toHaveValue("Product A");
      expect(screen.getByLabelText(/Price/i)).toHaveValue("100");
      // expect(screen.getByText(/Product A/i)).toBeInTheDocument();
      // expect(screen.getByText(/100/i)).toBeInTheDocument();
    });
  });

  test("updates a product", async () => {
    const mockNavigate = useNavigate as jest.Mock;

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

    render(
      //   <BrowserRouter>
      //     <Routes>
      //       <Route path="/edit/:id" id="1" element={<ProductForm />} />
      //     </Routes>
      //   </BrowserRouter>
      // <BrowserRouter>
      //   <Routes>
      //     <Route path={`/edit/${mockProduct._id}`} element={<ProductForm />} />
      //   </Routes>
      // </BrowserRouter>

      <BrowserRouter>
        <ProductForm />
      </BrowserRouter>
    );

    // Wait for the product form to be filled with mock data
    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });

    // Change product name and submit
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "Updated Product" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    // Assert API call
    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalled();
    });

    // Assert that useNavigate was called with the expected path
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
