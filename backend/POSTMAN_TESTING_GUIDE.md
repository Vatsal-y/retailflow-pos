# RetailFlow POS - Postman Manual Testing Guide

This guide provides a step-by-step walkthrough to verify the backend functionality using Postman.

## 🛠️ Prerequisites

*   **Base URL**: `http://localhost:8080/api`
*   **Headers**:
    *   `Content-Type`: `application/json`
    *   `Authorization`: `Bearer <token>` (Required for all steps after Login)

---

## 🟢 Step 1: Administrator Setup

First, we need to create an admin user and set up the store hierarchy.

### 1.1 Register Admin User
*   **Method**: `POST`
*   **URL**: `/auth/register`
*   **Body**:
    ```json
    {
      "email": "admin@retailflow.com",
      "password": "password123",
      "fullName": "Super Admin",
      "role": "SUPER_ADMIN",
      "phone": "9876543210"
    }
    ```
*   **Expect**: `200 OK` with a `token`. **Copy this token.**

### 1.2 Login (Optional Verification)
*   **Method**: `POST`
*   **URL**: `/auth/login`
*   **Body**:
    ```json
    {
      "email": "admin@retailflow.com",
      "password": "password123"
    }
    ```
*   **Expect**: `200 OK`. The response contains the JWT token.

---

## 🏢 Step 2: Store & Branch Creation

Now, use the **Admin Token** from Step 1 for these requests.
**Header**: `Authorization`: `Bearer <your_token_here>`

### 2.1 Create a Store
*   **Method**: `POST`
*   **URL**: `/stores`
*   **Body**:
    ```json
    {
      "name": "RetailFlow Supermart",
      "address": "123 Market Street",
      "phone": "011-23456789",
      "email": "contact@retailflow.com"
    }
    ```
*   **Expect**: `200 OK`. **Note the `id` (e.g., `1`) from the response.** This is your `STORE_ID`.

### 2.2 Create a Branch
*   **Method**: `POST`
*   **URL**: `/branches`
*   **Body**:
    ```json
    {
      "storeId": 1,
      "name": "Downtown Branch",
      "address": "456 City Center",
      "phone": "011-87654321",
      "active": true
    }
    ```
*   **Expect**: `200 OK`. **Note the `id` (e.g., `1`)**. This is your `BRANCH_ID`.

---

## 📦 Step 3: Inventory Setup

Still using the **Admin Token**.

### 3.1 Create a Category
*   **Method**: `POST`
*   **URL**: `/categories`
*   **Body**:
    ```json
    {
      "storeId": 1,
      "name": "Electronics",
      "description": "Gadgets and devices"
    }
    ```
*   **Expect**: `200 OK`. Note `id` (e.g., `1`) as `CATEGORY_ID`.

### 3.2 Add a Product
*   **Method**: `POST`
*   **URL**: `/products`
*   **Body**:
    ```json
    {
      "storeId": 1,
      "categoryId": 1,
      "name": "Wireless Mouse",
      "sku": "WM-001",
      "barcode": "8901234567890",
      "description": "Ergonomic wireless mouse",
      "price": 499.00,
      "costPrice": 250.00,
      "unit": "PIECE",
      "active": true
    }
    ```
*   **Expect**: `200 OK`.

---

## 🧑‍💼 Step 4: Cashier Setup

We need a separate user for POS operations.

### 4.1 Register Cashier
*   **Method**: `POST`
*   **URL**: `/auth/register`
*   **Body**:
    ```json
    {
      "email": "cashier@retailflow.com",
      "password": "cashier123",
      "fullName": "John Doe",
      "role": "CASHIER",
      "storeId": 1,
      "branchId": 1
    }
    ```
*   **Expect**: `200 OK`.

### 4.2 Login as Cashier
*   **Method**: `POST`
*   **URL**: `/auth/login`
*   **Body**:
    ```json
    {
      "email": "cashier@retailflow.com",
      "password": "cashier123"
    }
    ```
*   **Expect**: `200 OK`. **Copy this NEW token.** Use it for the next steps.

---

## 🛒 Step 5: POS Operations (Cashier Flow)

Use the **Cashier Token**.

### 5.1 Search Products
*   **Method**: `GET`
*   **URL**: `/products/search?storeId=1&q=Mouse`
*   **Expect**: List of products including "Wireless Mouse".

### 5.2 Create an Order (Checkout)
*   **Method**: `POST`
*   **URL**: `/orders`
*   **Body**:
    ```json
    {
      "branchId": 1,
      "cashierId": 2, 
      "customerId": null,
      "subtotal": 499.00,
      "totalAmount": 499.00,
      "paymentMethod": "CASH",
      "status": "COMPLETED",
      "items": [
        {
          "productId": 1,
          "productName": "Wireless Mouse",
          "quantity": 1,
          "unitPrice": 499.00,
          "totalPrice": 499.00
        }
      ]
    }
    ```
    *(Note: `cashierId` should match the user ID from Step 4.2 response)*
*   **Expect**: `200 OK` with JSON of the created order.

### 5.3 Verify Inventory (Optional)
*   **Method**: `GET`
*   **URL**: `/products/1`
*   **Expect**: Currently, inventory logic is inside `OrderService` which might update specific `Inventory` entities rather than the `Product` table directly, depending on implementation.

---

## 📊 Step 6: Analytics (Admin Flow)

Switch back to **Admin Token**.

### 6.1 Get Store Dashboard
*   **Method**: `GET`
*   **URL**: `/analytics/store/1/dashboard`
*   **Expect**: `200 OK` with sales stats (should show the order we just created).
