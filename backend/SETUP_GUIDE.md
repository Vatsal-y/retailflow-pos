# RetailFlow POS Backend - Setup Guide

## Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Git**

## Database Setup

1. **Install MySQL** (if not already installed)

2. **Create Database**
```sql
CREATE DATABASE retailflow_pos;
```

3. **Create MySQL User** (optional, or use root)
```sql
CREATE USER 'retailflow'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON retailflow_pos.* TO 'retailflow'@'localhost';
FLUSH PRIVILEGES;
```

## Application Setup

### Step 1: Configure Database Connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/retailflow_pos?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
```

Replace `YOUR_PASSWORD_HERE` with your MySQL root password.

### Step 2: Build the Project

```bash
cd backend
mvn clean install
```

### Step 3: Run the Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Step 4: Verify Application is Running

Open a browser and navigate to:
```
http://localhost:8080/api/actuator/health
```

You should see:
```json
{"status":"UP"}
```

## Creating Initial Data

### 1. Create Subscription Plans

Use a REST client (Postman, curl, or the frontend) to create subscription plans:

```bash
# Note: Subscription plans can be created directly in the database or via API
# For testing, you can manually insert via MySQL:

USE retailflow_pos;

INSERT INTO subscription_plans (name, price, max_branches, max_users, max_products, features, active, created_at, updated_at) VALUES
('Basic', 1299.00, 10, 50, 1000, 'Basic features', true, NOW(), NOW()),
('Pro', 2999.00, 100, 500, 9000, 'Advanced features', true, NOW(), NOW()),
('Enterprise', 4999.00, 400, 5000, 50000, 'Full features', true, NOW(), NOW());
```

### 2. Register First User (Super Admin)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@retailflow.com",
    "password": "admin123",
    "fullName": "Super Admin",
    "role": "SUPER_ADMIN"
  }'
```

### 3. Create a Store

Use the token from registration to create a store:

```bash
curl -X POST http://localhost:8080/api/stores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "My Retail Store",
    "ownerId": 1,
    "address": "123 Main Street",
    "phone": "+1234567890",
    "email": "store@example.com",
    "status": "ACTIVE"
  }'
```

### 4. Create a Branch

```bash
curl -X POST http://localhost:8080/api/branches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "storeId": 1,
    "name": "Main Branch",
    "address": "123 Main St",
    "city": "New York",
    "active": true
  }'
```

## Connecting Frontend

### Update Frontend API Base URL

In your React frontend, update the API base URL to point to the backend:

```javascript
// In your Redux slices or API configuration
const API_BASE_URL = 'http://localhost:8080/api';
```

### CORS is Pre-Configured

The backend is already configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)

If your frontend runs on a different port, update `application.properties`:

```properties
cors.allowed-origins=http://localhost:YOUR_PORT
```

## Testing the API

### Using the API Documentation

Refer to `API_DOCUMENTATION.md` for complete API endpoint details.

### Quick Test Flow

1. **Register/Login** → Get JWT token
2. **Create Store** → Get store ID
3. **Create Branch** → Get branch ID  
4. **Create Categories** → Product organization
5. **Create Products** → Inventory items
6. **Start Shift** → Begin cashier session
7. **Create Order** → Process sale
8. **View Analytics** → See dashboard data

## Common Issues

### MySQL Connection Error
- Verify MySQL is running: `sudo service mysql status`
- Check username/password in `application.properties`
- Ensure database exists: `SHOW DATABASES;`

### Port Already in Use
- Change port in `application.properties`: `server.port=8081`
- Or stop the process using port 8080

### JWT Token Issues
- Ensure `jwt.secret` in `application.properties` is at least 256 bits (32 characters)
- Token expires after 1 hour - login again to get a new token

## Development Mode

The application includes Spring Boot DevTools for hot reload. Any changes to Java files will automatically restart the application.

## Production Deployment

For production:

1. Update `application.properties` with production database credentials
2. Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`)
3. Use a secure JWT secret
4. Enable HTTPS
5. Build the JAR:
   ```bash
   mvn clean package -DskipTests
   ```
6. Run the JAR:
   ```bash
   java -jar target/retailflow-pos-1.0.0.jar
   ```

## Next Steps

1. Test all API endpoints using the documentation
2. Connect the React frontend
3. Create sample data (products, categories, customers)
4. Test the complete POS flow from the cashier interface

## Support

For issues or questions:
- Check `API_DOCUMENTATION.md` for endpoint details
- Review application logs in the console
- Verify database tables were created: `SHOW TABLES;`
