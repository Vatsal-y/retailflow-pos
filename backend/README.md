# RetailFlow POS - Spring Boot Backend

A production-ready Spring Boot backend for a multi-tenant SaaS Point of Sale (POS) system supporting cashier terminals, branch dashboards, store administration, and super admin panels.

## 🚀 Features

- **Multi-Tenant SaaS Architecture** - Store-based tenancy with branch isolation
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - 4 roles (SUPER_ADMIN, STORE_ADMIN, BRANCH_MANAGER, CASHIER)
- **Complete POS Operations** - Order processing, inventory management, refunds
- **Real-Time Analytics** - Branch and store-level dashboards with KPIs
- **Shift Management** - Track cashier shifts with sales breakdowns
- **Customer Loyalty** - Automatic loyalty points calculation
- **Subscription Management** - SaaS plan tiers with usage limits

## 📋 Tech Stack

- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17
- **Database**: MySQL 8.0+
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven

## 🏗️ Architecture

### Domain Entities (14)
- User, Store, Branch, Product, Category
- Inventory, Employee, Customer, Order, OrderItem
- Refund, ShiftReport, SubscriptionPlan

### REST APIs (15+ Controllers)
- Authentication & User Management
- Store & Branch Management
- Product Catalog & Inventory
- Order Processing & Refunds
- Shift Reports & Analytics
- Customer & Employee Management
- Subscription Plans

## 🔧 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Setup

1. **Clone and navigate to backend**
```bash
cd backend
```

2. **Configure database**

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

3. **Run the application**
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete installation and configuration
- **[API Documentation](API_DOCUMENTATION.md)** - All endpoints with examples

## 🔐 Default Configuration

- **Port**: 8080
- **Context Path**: /api
- **JWT Expiration**: 1 hour
- **Refresh Token**: 7 days
- **CORS**: Configured for `localhost:5173` and `localhost:3000`

## 📊 Key Endpoints

```
POST   /api/auth/register      - User registration
POST   /api/auth/login         - User login
GET    /api/products/search    - Product search (barcode/SKU)
POST   /api/orders             - Create order (checkout)
POST   /api/shift-reports/start - Start cashier shift
GET    /api/analytics/branch/{id}/dashboard - Branch KPIs
GET    /api/analytics/store/{id}/dashboard  - Store overview
```

## 🏪 Business Logic

### Order Processing
- Auto-generates unique order numbers
- Deducts inventory automatically
- Updates customer loyalty points (1 point per ₹100)
- Tracks shift report analytics

### Inventory Management
- Real-time stock tracking
- Low stock alerts (configurable threshold)
- Multi-branch inventory isolation

### Analytics
- Daily sales trends
- Payment method breakdowns
- Top-selling products
- Branch performance comparison

## 🔒 Security Features

- BCrypt password hashing
- JWT-based stateless authentication
- Role-based endpoint protection
- CORS configuration for frontend
- Request validation

## 📦 Project Structure

```
backend/
├── src/main/java/com/retailflow/pos/
│   ├── config/          # Security, CORS, JWT config
│   ├── controller/      # REST controllers
│   ├── entity/          # JPA entities
│   ├── repository/      # Data access layer
│   ├── service/         # Business logic
│   ├── dto/             # Request/Response DTOs
│   └── exception/       # Exception handling
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── README.md
```

## 🧪 Testing

1. Verify application health:
```bash
curl http://localhost:8080/api/actuator/health
```

2. Register a user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@store.com","password":"test123","fullName":"Test User","role":"STORE_ADMIN"}'
```

3. See `API_DOCUMENTATION.md` for complete examples

## 🌐 Frontend Integration

This backend is designed to work with the existing React frontend. Update your frontend API base URL:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

All requests (except `/auth/**`) require the JWT token:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

## 📄 License

This project is part of the RetailFlow POS system.

## 👤 Author

Built as a comprehensive Spring Boot backend for the RetailFlow SaaS POS platform.
