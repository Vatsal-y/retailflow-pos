# RetailFlow POS

<div align="center">

![RetailFlow Logo](https://img.shields.io/badge/RetailFlow-POS-1a472a?style=for-the-badge&logoColor=white)

**A modern, full-stack Point of Sale system for multi-branch retail operations**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=flat-square&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

</div>

---

## 📋 Overview

RetailFlow POS is a comprehensive point-of-sale solution designed for multi-branch retail businesses. It provides complete sales management, inventory tracking, employee management, and real-time analytics - all from a single, intuitive dashboard.

### ✨ Key Features

- **🛒 Smart POS Terminal** - Intuitive checkout interface with barcode scanning and quick product search
- **📊 Advanced Analytics** - Real-time sales reports, revenue tracking, and branch-wise analytics
- **🏪 Multi-Branch Management** - Manage multiple store locations from a centralized dashboard
- **👥 Role-Based Access Control** - Four user roles: Super Admin, Store Admin, Branch Manager, Cashier
- **📦 Inventory Management** - Track stock levels, set reorder alerts, manage products
- **⏰ Shift Management** - Track cashier shifts with opening/closing amounts
- **👤 Customer Management** - Maintain customer database with purchase history
- **💳 Multiple Payment Methods** - Support for cash, card, and digital payments

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI Framework |
| TypeScript | 5.9 | Type Safety |
| Vite | 7.2 | Build Tool |
| TailwindCSS | 4.1 | Styling |
| Zustand | 5.0 | State Management |
| React Router | 7.13 | Routing |
| Recharts | 3.7 | Charts & Analytics |
| React Hook Form | 7.71 | Form Handling |
| Axios | 1.13 | HTTP Client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.2.2 | Backend Framework |
| Java | 17 | Programming Language |
| Spring Security | - | Authentication & Authorization |
| Spring Data JPA | - | Database ORM |
| MySQL | 8.0 | Database |
| JWT | 0.11.5 | Token Authentication |
| Lombok | - | Boilerplate Reduction |
| ModelMapper | 3.2 | DTO Mapping |

---

## 📁 Project Structure

```
retailflow-pos/
├── frontend/                 # React Frontend Application
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state management
│   │   ├── types/           # TypeScript type definitions
│   │   └── lib/             # Utility functions
│   └── package.json
│
├── backend/                  # Spring Boot Backend
│   ├── src/main/java/com/retailflow/pos/
│   │   ├── config/          # Security & app configuration
│   │   ├── controller/      # REST API controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Custom exceptions
│   │   ├── repository/      # Data access layer
│   │   ├── security/        # JWT & security components
│   │   └── service/         # Business logic layer
│   └── pom.xml
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.8+
- **MySQL** 8.0+

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/retailflow-pos.git
   cd retailflow-pos/backend
   ```

2. **Configure the database**
   
   Create a MySQL database and update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/retailflow_pos
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd retailflow-pos/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full system access, manage stores, manage all users |
| **Store Admin** | Manage branches, employees, products, view reports |
| **Branch Manager** | Manage branch inventory, employees, view branch reports |
| **Cashier** | POS terminal access, process sales, manage shifts |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@store.com | password123 |
| Cashier | cashier@store.com | password123 |

---

## 📈 Core Modules

### 1. Dashboard
- Sales overview with daily/weekly/monthly stats
- Revenue trends and charts
- Top selling products
- Recent orders

### 2. POS Terminal
- Product search and barcode scanning
- Cart management
- Multiple payment methods
- Receipt generation
- Customer selection

### 3. Orders Management
- View all orders
- Filter by status, date, payment method
- Order details and refunds

### 4. Inventory Management
- Product catalog
- Stock level tracking
- Low stock alerts
- Category management

### 5. Employee Management
- Add/edit employees
- Role assignment
- Branch assignment

### 6. Reports & Analytics
- Sales reports with date filters
- Branch-wise analytics
- Revenue breakdown
- Export capabilities

---

## 🔌 API Documentation

The backend exposes RESTful APIs for all operations. See the [API Documentation](./backend/API_DOCUMENTATION.md) for detailed endpoint information.

### Base URL
```
http://localhost:8080/api
```

### Key Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/products` - List products
- `POST /api/orders` - Create order
- `GET /api/analytics/*` - Analytics endpoints

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Build
```bash
cd frontend
npm run build
```

---

## 📝 Additional Documentation

- [Backend README](./backend/README.md)
- [API Documentation](./backend/API_DOCUMENTATION.md)
- [Setup Guide](./backend/SETUP_GUIDE.md)
- [Testing Plan](./backend/TESTING_PLAN.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for modern retail**

</div>
