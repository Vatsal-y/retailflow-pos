# RetailFlow POS Backend - Comprehensive Testing Plan

This document outlines the strategy for testing the RetailFlow POS Spring Boot backend to ensure reliability, security, and performance.

## 1. Testing Pyramid Strategy

We will follow the standard testing pyramid:
1.  **Unit Tests (70%)**: Fast, isolated tests for individual components (Services, Utils).
2.  **Integration Tests (20%)**: Tests verifying interaction between components (Controllers <-> Services <-> Database).
3.  **E2E / API Tests (10%)**: Verification of full user flows via HTTP endpoints.

---

## 2. Unit Testing (Services & Logic)

**Focus**: Business logic verification, edge cases, and exception handling.
**Tools**: JUnit 5, Mockito.

### Key Components to Test:

#### A. AuthService
*   **Register**:
    *   Success: Valid user data creates a new record.
    *   Fail: Duplicate email throws `UserAlreadyExistsException`.
    *   Fail: Invalid role throws validation error.
*   **Login**:
    *   Success: Correct credentials return valid JWT.
    *   Fail: Wrong password/email throws `BadCredentialsException`.

#### B. OrderService
*   **Create Order**:
    *   Success: Valid order reduces inventory and saves order.
    *   Calculation: Verify total amount = sum(item price * quantity).
    *   Fail: Insufficient stock throws `OutOfStockException`.
*   **Refund**:
    *   Success: Reverts inventory and updates order status.

#### C. JwtService
*   **Token Generation**: Verify claims (username, role) are correctly encoded.
*   **Validation**: Verify expired or tampered tokens result in false/exception.

### Implementation Pattern (Example):
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock
    private ProductRepository productRepository;
    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrder_InsufficientStock_ThrowsException() {
        // Setup mocks
        when(productRepository.findById(any())).thenReturn(Optional.of(productWithZeroStock));
        
        // Assert
        assertThrows(OutOfStockException.class, () -> orderService.createOrder(request));
    }
}
```

---

## 3. Integration Testing (Controllers & Security)

**Focus**: HTTP request handling, security filters, serialization, and database interaction.
**Tools**: `@SpringBootTest`, `@AutoConfigureMockMvc`, H2 Database (or Testcontainers).

### Key Scenarios:

#### A. Security & Auth
*   **Public Endpoints**: Verify `/api/auth/**` is accessible without token.
*   **Protected Endpoints**: Verify `/api/orders` returns `401 Unauthorized` without token.
*   **RBAC**:
    *   Verify `BRANCH_MANAGER` cannot access `SUPER_ADMIN` endpoints.
    *   Verify `CASHIER` can only access POS-related endpoints.

#### B. Controller Flow
*   **ProductController**:
    *   `GET /api/products`: Returns JSON list of products.
    *   `POST /api/products`: Verify input validation (e.g., price cannot be negative).

### Implementation Pattern (Example):
```java
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void login_ValidCredentials_ReturnsToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@test.com\", \"password\":\"pass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }
}
```

---

## 4. API / End-to-End Testing

**Focus**: Real-world usage scenarios.
**Tools**: Postman Collection, Newman (CI/CD), or customized `curl` scripts.

### Test Scenarios:
1.  **Full POS Lifecycle**:
    *   Login as Cashier -> Search Product -> Create Order -> Process Payment -> Verify Stock Reduction.
2.  **Admin Lifecycle**:
    *   Login as Admin -> Create Product -> Assign to Branch -> View in Branch Inventory.
3.  **Shift Management**:
    *   Start Shift -> Process Orders -> End Shift -> Verify Shift Report Totals.

---

## 5. Performance & Load Testing (Optional)

**Focus**: System stability under high load.
**Tools**: Apache JMeter or k6.

*   **Scenario**: 50 concurrent cashiers processing orders simultaneously.
*   **Metrics**: API latency < 200ms, Database connection pool usage.

---

## 6. Execution Plan

1.  **Setup Test Environment**:
    *   Ensure `application-test.properties` uses an in-memory DB (H2) or a separate test MySQL instance.
2.  **Run Unit Tests**:
    *   `mvn test` (Runs all tests ending in `*Test.java`).
3.  **Run Integration Tests**:
    *   `mvn verify` (Runs detailed integration tests).
4.  **Coverage Report**:
    *   Use Jacoco plugin to verify >80% code coverage.
