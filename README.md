# Product Management Application

A comprehensive application for managing products, including features for creating, editing, and viewing product details.

## Table of Contents

- [Project Setup](#project-setup)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [Running Unit Tests](#running-unit-tests)
- [Examples](#examples)
- [Assumptions](#assumptions)

## Project Setup

### Prerequisites

Ensure you have the following installed:
- Node.js
- npm or yarn
- React

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://https://github.com/YoussefElattarr/ngfstask.git
    cd ngfstask
    ```

2. **Install Backend Dependencies**

    ```bash
    cd server
    npm install
    ```

3. **Install Frontend Dependencies**

    ```bash
    cd ..
    cd client
    npm install --legacy-peer-deps
    ```

## Running the Backend

1. **Navigate to the Backend Directory**

    ```bash
    cd ..
    cd server
    ```
    
2. **Create a .env file and copy the content of .env.template file**

3. **Navigate to the seeds directory and seed the database**

   ```bash
   cd seeds
   node seed.js
   ```

5. **Navigate back to the server and start the Backend Server**

    ```bash
    cd ..
    node server.js
    ```

    The server will be available at `http://localhost:3001`.

## Running the Frontend

1. **Navigate to the Frontend Directory**

    ```bash
    cd ..
    cd client
    cd src
    ```

2. **Start the Frontend Application**

    ```bash
    npm start
    ```

    The frontend will be available at `http://localhost:3000`.

## Running Unit Tests

**Make sure to terminate any running code**

1. **Navigate to the Backend Directory**

    ```bash
    cd ..
    cd server
    ```

2. **Run Unit Tests (Will delete all entries in the database)**

    ```bash
    npm test
    ```

1. **Navigate to the Frontend Directory**

    ```bash
    cd ..
    cd client
    cd src
    ```

2. **Run Unit Tests**

    ```bash
    npm test
    ```

    Jest will run all the tests and provide a coverage report.


## Examples
### Backend
1. **Create a Product**
   Make a POST request to `http://localhost:3001/product/` with an example body like
   
   ```json
     {
    "productName":"Test Product",
    "category":"Beauty",
    "price":"99.99",
    "availabilityDate":"2025-09-01"
      }
   ```
2. **Update a Product**
   Make a PUT request to `http://localhost:3001/product/:id` replacing `:id` with the actual product ID, with an example body like
   
   ```json
     {
    "productName":"Updated Product"
      }
   ```
3. **Get a Product**
   Make a GET request to `http://localhost:3001/product/:id` replacing `:id` with the actual product ID
4. **Delete a Product**
   Make a DELETE request to `http://localhost:3001/product/:id` replacing `:id` with the actual product ID
5. **Get Products With Filters**
   Make a GET request to `http://localhost:3001/product/` with an example query params like
   
   ```json
     {
    "page":1,
     "limit":10,
    "sort":"productName",
    "productName":"smartphone",
    "category":"electronics",
     "priceRange":"100:400",
     "dateRange":"2024-09-01:2024-10-30"
      }
   ```
### Frontend

### View Products

1. **Navigate to the Product List**

    Open `http://localhost:3000/` to view all products.

2. **Sort the Products**

    Click on price or product name column to sort the products.
   
3. **Filter Products**

     Fill the fields of the filters and click search to filter the products.

### Edit an Existing Product

1. **Navigate to the Product List**

    Open `http://localhost:3000/` to view all products.
   
2. **Click on Edit Button**
   
   Click on the edit button of the product and you will be redirected to `http://localhost:3000/edit/:id` where `:id` will be the actual product ID.  

3. **Edit the Product**

    Modify the product details and submit. The updated data will be sent to the backend.

### Delete an Existing Product

1. **Navigate to the Product List**

    Open `http://localhost:3000/` to view all products.
   
2. **Click on Delete Button**
   
   Click on the delete button of the product and the product will be removed.
   
### Create a New Product

1. **Navigate to the Product List**

    Open `http://localhost:3000/` to view all products.

2. **Click on Add Product**
   
   Click on the add product button in the app bar and you will be redirected to `http://localhost:3000/add`.
   
3. **Fill Out the Form**

    Enter the product details and submit. The data will be sent to the backend and stored in the database.


## Assumptions

1. It is assumed that catgories are already predefined and saved in a file to be exported
2. It is assumed that the user cannot create a product with availability date starting today, it must be available by tomorrow

