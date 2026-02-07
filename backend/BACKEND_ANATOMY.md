# RetailFlow POS Backend - Anatomy & Architecture

This document provides a deep dive into the internal structure, components, and data flow of the RetailFlow POS backend. It is designed to help developers understand "how it works under the hood".

## 1. High-Level Architecture

The application follows a standard **Layered Architecture** (Controller-Service-Repository pattern) built on **Spring Boot**.

```mermaid
graph TD
    Client[Frontend / API Client] -->|HTTP Request| Security[Spring Security Filter Chain]
    Security -->|Authorized| Controller[REST Controller Layer]
    Controller -->|DTO| Service[Service Layer (Business Logic)]
    Service -->|Entity| Repository[Repository Layer (JPA)]
    Repository -->|SQL| Database[(MySQL Database)]
```

---

## 2. Directory Structure Explained

The codebase is organized by technical layer, but grouped logically around domain features.

### `src/main/java/com/retailflow/pos`

| Package | Purpose | Key Components |
| :--- | :--- | :--- |
| **`config`** | Configuration & Setup | `SecurityConfig` (Security rules), `CorsConfig` (Cross-Origin), `ApplicationConfig` (Beans) |
| **`controller`** | API Endpoints | Handles HTTP requests, validates input, calls services. Returns `ResponseEntity`. |
| **`service`** | Business Logic | Core application logic. Transaction management (`@Transactional`), complex calculations. |
| **`repository`** | Data Access | Interfaces extending `JpaRepository`. Custom queries using `@Query`. |
| **`entity`** | Data Model | Hibernate/JPA Entities mapping to database tables. Setup with relationships (`@OneToMany`, etc.). |
| **`dto`** | Data Transfer Objects | POJOs for request/response bodies to decouple API from Database Entities. |
| **`exception`** | Error Handling | `GlobalExceptionHandler` and custom exceptions (e.g., `ResourceNotFoundException`). |
| **`security`** | Auth Implementation | `JwtAuthenticationFilter`, `JwtService`, `UserDetailServiceImpl`. |

---

## 3. Key Modules & Data Flow

### A. Authentication & Security Module
*   **Flow**: User sends credentials -> `AuthController` -> `AuthenticationManager` -> `UserDetailServiceImpl` (loads user from DB) -> `JwtService` (generates token).
*   **Security Filter**: Requests are intercepted by `JwtAuthenticationFilter`. It validates the `Authorization: Bearer <token>` header. If valid, sets `SecurityContext`.
*   **RBAC**: Annotations like `@PreAuthorize("hasRole('ADMIN')")` secure endpoints.

### B. Order Processing Module
*   **Controller**: `OrderController` receives `OrderRequestDTO`.
*   **Service**: `OrderService` performs:
    1.  Validates stock for each item.
    2.  Calculates totals (subtotal, tax, discount).
    3.  Creates `Order` and `OrderItem` entities.
    4.  Updates `Product` inventory (decrements stock).
    5.  Updates `Customer` loyalty points (if applicable).
*   **Transaction**: The entire operation is atomic. If stock update fails, the order is rolled back.

### C. Shift Management Module
*   **Purpose**: Tracks cashier activity.
*   **Flow**:
    1.  Start Shift (`ShiftReportController`): Records start time and initial cash.
    2.  During Shift: Orders are linked to the active shift.
    3.  End Shift: Calculates total sales, expected cash, and discrepancies.

---

## 4. Database Schema Relationships

Key entity relationships that drive the system:

*   **Store -> Branch**: One-to-Many. A store (tenant) has multiple branches.
*   **Branch -> Employee**: One-to-Many. Employees belong to a specific branch.
*   **Branch -> Product (Inventory)**: Many-to-Many (via `Inventory` entity). Products can exist in multiple branches with different stock levels.
*   **Order -> OrderItem**: One-to-Many. An order contains multiple items.
*   **Customer -> Order**: One-to-Many. A customer can have multiple orders.

---

## 5. Configuration Files

### `application.properties`
*   **Database**: Connection URL, username, password.
*   **JPA/Hibernate**: `ddl-auto` (update/validate), dialect.
*   **JWT**: Secret key, expiration time.
*   **Server**: Port (default 8080).

---

## 6. How to Extend

1.  **Add a new Entity**: Create class in `entity` package, add `@Entity`, define fields.
2.  **Create Repository**: Interface in `repository` extending `JpaRepository`.
3.  **Create DTOs**: Request/Response records in `dto` package.
4.  **Implement Service**: Class in `service` with business logic.
5.  **Create Controller**: Class in `controller` with `@RestController` and endpoints.
6.  **Secure It**: Add permission checks in `SecurityConfig` or via annotations.
