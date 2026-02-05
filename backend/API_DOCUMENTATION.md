# RetailFlow POS Backend - API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "admin@store.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "role": "STORE_ADMIN",
  "storeId": null,
  "branchId": null
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@store.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "admin@store.com",
  "fullName": "John Doe",
  "role": "STORE_ADMIN",
  "userId": 1,
  "storeId": 1,
  "branchId": null
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer {token}
```

## Product Endpoints

### Create Product
```
POST /products
Authorization: Bearer {token}
Content-Type: application/json

{
  "storeId": 1,
  "categoryId": 1,
  "name": "Product Name",
  "sku": "SKU123",
  "barcode": "123456789",
  "description": "Product description",
  "price": 99.99,
  "costPrice": 50.00,
  "unit": "PIECE",
  "active": true
}
```

### Search Products (for POS)
```
GET /products/search?storeId=1&q=SKU123
Authorization: Bearer {token}
```

### Get All Products
```
GET /products?storeId=1
Authorization: Bearer {token}
```

## Order Endpoints

### Create Order (Checkout)
```
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "branchId": 1,
  "customerId": 1,
  "cashierId": 1,
  "items": [
    {
      "productId": 1,
      "productName": "Item 1",
      "quantity": 2,
      "unitPrice": 99.99,
      "totalPrice": 199.98
    }
  ],
  "subtotal": 199.98,
  "discountAmount": 10.00,
  "discountPercentage": 5.0,
  "totalAmount": 189.98,
  "paymentMethod": "CASH",
  "notes": "Optional notes"
}
```

### Get Orders
```
GET /orders?branchId=1
Authorization: Bearer {token}
```

### Get Order History
```
GET /orders/history?branchId=1&startDate=2026-02-01T00:00:00&endDate=2026-02-05T23:59:59
Authorization: Bearer {token}
```

## Shift Report Endpoints

### Start Shift
```
POST /shift-reports/start?branchId=1&cashierId=1
Authorization: Bearer {token}
```

### End Shift
```
POST /shift-reports/end?cashierId=1
Authorization: Bearer {token}
```

### Get Shift Reports
```
GET /shift-reports?branchId=1
Authorization: Bearer {token}
```

## Analytics Endpoints

### Branch Dashboard
```
GET /analytics/branch/1/dashboard
Authorization: Bearer {token}

Response:
{
  "todaySales": 1500.50,
  "weekSales": 8450.00,
  "todayOrders": 45,
  "lowStockCount": 5
}
```

### Sales Trend (Last 7 Days)
```
GET /analytics/branch/1/sales-trend?days=7
Authorization: Bearer {token}
```

### Payment Method Breakdown
```
GET /analytics/branch/1/payment-breakdown?startDate=2026-02-01T00:00:00&endDate=2026-02-05T23:59:59
Authorization: Bearer {token}
```

### Low Stock Items
```
GET /analytics/branch/1/low-stock
Authorization: Bearer {token}
```

### Store Dashboard
```
GET /analytics/store/1/dashboard
Authorization: Bearer {token}
```

## Store & Branch Management

### Create Store
```
POST /stores
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Retail Store",
  "address": "123 Main St",
  "phone": "+1234567890",
  "email": "store@example.com",
  "status": "ACTIVE"
}
```

### Create Branch
```
POST /branches
Authorization: Bearer {token}
Content-Type: application/json

{
  "storeId": 1,
  "name": "Downtown Branch",
  "address": "456 Oak Ave",
  "city": "New York",
  "phone": "+1234567890",
  "active": true
}
```

## Customer Management

### Create Customer
```
POST /customers
Authorization: Bearer {token}
Content-Type: application/json

{
  "storeId": 1,
  "name": "Jane Smith",
  "phone": "+1234567890",
  "email": "jane@example.com",
  "address": "789 Pine St"
}
```

### Get Customers
```
GET /customers?storeId=1
Authorization: Bearer {token}
```

## Inventory Management

### Get Inventory
```
GET /inventory?branchId=1
Authorization: Bearer {token}
```

### Update Inventory
```
PUT /inventory/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 100,
  "reorderLevel": 10
}
```

## Refund Management

### Create Refund
```
POST /refunds
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": 1,
  "amount": 50.00,
  "reason": "Product defective",
  "processedBy": 1,
  "status": "PENDING"
}
```

### Approve Refund
```
PUT /refunds/1/approve?approvedBy=2
Authorization: Bearer {token}
```

## Category Management

### Create Category
```
POST /categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "storeId": 1,
  "name": "Electronics",
  "description": "Electronic items",
  "active": true
}
```

### Get Categories
```
GET /categories?storeId=1
Authorization: Bearer {token}
```

## Subscription Plans

### Get All Plans
```
GET /subscriptions/plans
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "name": "Basic",
    "price": 1299.00,
    "maxBranches": 10,
    "maxUsers": 50,
    "maxProducts": 1000
  }
]
```

## Employee Management

### Create Employee
```
POST /employees
Authorization: Bearer {token}
Content-Type: application/json

{
  "branchId": 1,
  "userId": 1,
  "position": "Cashier",
  "salary": 30000.00,
  "hireDate": "2026-01-15",
  "status": "ACTIVE"
}
```

### Get Employees
```
GET /employees?branchId=1
Authorization: Bearer {token}
```

## Notes

- All authenticated endpoints require the `Authorization: Bearer {token}` header
- The token is obtained from the `/auth/login` endpoint
- Token expires after 1 hour (3600000 ms)
- Refresh token expires after 7 days (604800000 ms)
- All dates should be in ISO 8601 format: `yyyy-MM-ddTHH:mm:ss`
