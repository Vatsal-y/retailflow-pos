package com.retailflow.pos.config;

import com.retailflow.pos.entity.*;
import com.retailflow.pos.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if no stores exist (fresh database)
        if (storeRepository.count() > 0) {
            log.info("Database already has data, skipping seed");
            return;
        }

        log.info("🚀 Seeding demo data...");

        // Create Store Admin user FIRST (required as owner for the store)
        User admin = new User();
        admin.setEmail("admin@store.com");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setFullName("Store Admin");
        admin.setPhone("+91 9876543211");
        admin.setRole(User.Role.STORE_ADMIN);
        admin.setActive(true);
        admin = userRepository.save(admin);
        log.info("✅ Created store admin user");

        // Create a demo store with the admin as owner
        Store store = new Store();
        store.setName("RetailFlow Demo Store");
        store.setAddress("123 Main Street, Mumbai, Maharashtra 400001");
        store.setPhone("+91 9876543210");
        store.setEmail("contact@retailflowdemo.com");
        store.setStatus(Store.Status.ACTIVE);
        store.setOwnerId(admin.getId());  // Set the owner
        store = storeRepository.save(store);
        log.info("✅ Created demo store: {}", store.getName());

        // Update the admin with the store ID
        admin.setStoreId(store.getId());
        userRepository.save(admin);

        // Create branches
        Branch mainBranch = createBranch(store.getId(), "Main Branch", "Mumbai", "123 Main Street");
        Branch westBranch = createBranch(store.getId(), "West Side Branch", "Mumbai", "456 West Avenue");
        log.info("✅ Created {} branches", 2);

        // Create remaining users (Super Admin, Manager, Cashier)
        createUsers(store.getId(), mainBranch.getId());
        log.info("✅ Created demo users");

        // Create categories
        List<Category> categories = createCategories(store.getId());
        log.info("✅ Created {} categories", categories.size());

        // Create products
        List<Product> products = createProducts(store.getId(), categories);
        log.info("✅ Created {} products", products.size());

        // Create inventory for products at branches
        createInventory(products, mainBranch.getId());
        createInventory(products, westBranch.getId());
        log.info("✅ Created inventory records");

        // Create customers
        createCustomers(store.getId());
        log.info("✅ Created demo customers");

        log.info("========================================");
        log.info("🎉 Demo data seeding completed!");
        log.info("========================================");
        log.info("Demo Credentials:");
        log.info("  Super Admin: superadmin@store.com / password123");
        log.info("  Store Admin: admin@store.com / password123");
        log.info("  Manager: manager@store.com / password123");
        log.info("  Cashier: cashier@store.com / password123");
        log.info("========================================");
    }

    private Branch createBranch(Long storeId, String name, String city, String address) {
        Branch branch = new Branch();
        branch.setStoreId(storeId);
        branch.setName(name);
        branch.setCity(city);
        branch.setAddress(address);
        branch.setPhone("+91 98765" + (10000 + (int)(Math.random() * 90000)));
        branch.setActive(true);
        return branchRepository.save(branch);
    }

    private void createUsers(Long storeId, Long branchId) {
        // Super Admin (no store association - platform level user)
        User superAdmin = new User();
        superAdmin.setEmail("superadmin@store.com");
        superAdmin.setPassword(passwordEncoder.encode("password123"));
        superAdmin.setFullName("Super Admin");
        superAdmin.setPhone("+91 9876543210");
        superAdmin.setRole(User.Role.SUPER_ADMIN);
        superAdmin.setActive(true);
        userRepository.save(superAdmin);

        // Note: Store Admin is created earlier in run() method as store owner

        // Branch Manager
        User manager = new User();
        manager.setEmail("manager@store.com");
        manager.setPassword(passwordEncoder.encode("password123"));
        manager.setFullName("Branch Manager");
        manager.setPhone("+91 9876543212");
        manager.setRole(User.Role.BRANCH_MANAGER);
        manager.setStoreId(storeId);
        manager.setBranchId(branchId);
        manager.setActive(true);
        userRepository.save(manager);

        // Cashier
        User cashier = new User();
        cashier.setEmail("cashier@store.com");
        cashier.setPassword(passwordEncoder.encode("password123"));
        cashier.setFullName("Demo Cashier");
        cashier.setPhone("+91 9876543213");
        cashier.setRole(User.Role.CASHIER);
        cashier.setStoreId(storeId);
        cashier.setBranchId(branchId);
        cashier.setActive(true);
        userRepository.save(cashier);
    }

    private List<Category> createCategories(Long storeId) {
        String[] categoryNames = {"Beverages", "Dairy", "Snacks", "Groceries", "Personal Care", "Household"};
        
        return Arrays.stream(categoryNames).map(name -> {
            Category category = new Category();
            category.setStoreId(storeId);
            category.setName(name);
            category.setDescription(name + " products");
            category.setActive(true);
            return categoryRepository.save(category);
        }).toList();
    }

    private List<Product> createProducts(Long storeId, List<Category> categories) {
        // Products organized by category index
        Object[][] productData = {
            // Beverages (index 0)
            {"Coca-Cola 500ml", 40.00, 35.00, "COC500"},
            {"Pepsi 500ml", 40.00, 35.00, "PEP500"},
            {"Sprite 500ml", 40.00, 35.00, "SPR500"},
            {"Thumbs Up 500ml", 40.00, 35.00, "THU500"},
            {"Maaza 600ml", 35.00, 30.00, "MAA600"},
            {"Red Bull 250ml", 125.00, 110.00, "RBL250"},
            // Dairy (index 1)
            {"Amul Butter 100g", 56.00, 50.00, "AMB100"},
            {"Amul Milk 1L", 68.00, 60.00, "AML001"},
            {"Mother Dairy Curd 400g", 45.00, 40.00, "MDC400"},
            {"Paneer 200g", 90.00, 80.00, "PAN200"},
            // Snacks (index 2)
            {"Lays Classic 50g", 20.00, 16.00, "LAY050"},
            {"Kurkure Masala 100g", 30.00, 25.00, "KUR100"},
            {"Haldirams Bhujia 200g", 80.00, 70.00, "HBJ200"},
            {"Parle-G 100g", 10.00, 8.00, "PLG100"},
            {"Oreo 50g", 30.00, 25.00, "ORE050"},
            {"Britannia Good Day", 25.00, 20.00, "BGD100"},
            // Groceries (index 3)
            {"Tata Salt 1kg", 28.00, 24.00, "TST001"},
            {"Fortune Sunflower Oil 1L", 165.00, 150.00, "FSO001"},
            {"Aashirvaad Atta 5kg", 295.00, 270.00, "AAT005"},
            {"Maggi Noodles 70g", 14.00, 12.00, "MAG070"},
            {"Basmati Rice 1kg", 150.00, 135.00, "BRC001"},
            // Personal Care (index 4)
            {"Colgate MaxFresh 100g", 95.00, 85.00, "CMF100"},
            {"Dove Soap 100g", 65.00, 58.00, "DVS100"},
            {"Head & Shoulders 180ml", 245.00, 220.00, "HNS180"},
            {"Dettol Handwash 200ml", 75.00, 65.00, "DHW200"},
            // Household (index 5)
            {"Vim Bar 155g", 20.00, 17.00, "VIM155"},
            {"Surf Excel 1kg", 195.00, 175.00, "SXL001"},
            {"Harpic 500ml", 95.00, 85.00, "HAR500"},
            {"Colin Glass Cleaner 500ml", 125.00, 110.00, "CGC500"},
        };

        int[] categoryIndices = {0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5};

        return java.util.stream.IntStream.range(0, productData.length).mapToObj(i -> {
            Object[] data = productData[i];
            Product product = new Product();
            product.setStoreId(storeId);
            product.setCategoryId(categories.get(categoryIndices[i]).getId());
            product.setName((String) data[0]);
            product.setPrice(BigDecimal.valueOf((Double) data[1]));
            product.setCostPrice(BigDecimal.valueOf((Double) data[2]));
            product.setSku((String) data[3]);
            product.setBarcode("8901234" + String.format("%06d", i));
            product.setDescription((String) data[0] + " - Premium quality product");
            product.setActive(true);
            product.setUnit(Product.Unit.PIECE);
            return productRepository.save(product);
        }).toList();
    }

    private void createInventory(List<Product> products, Long branchId) {
        products.forEach(product -> {
            Inventory inventory = new Inventory();
            inventory.setProductId(product.getId());
            inventory.setBranchId(branchId);
            // Random quantity between 5 and 100
            int quantity = 5 + (int)(Math.random() * 95);
            inventory.setQuantity(quantity);
            inventory.setReorderLevel(10);
            inventory.setMaxStockLevel(200);
            inventoryRepository.save(inventory);
        });
    }

    private void createCustomers(Long storeId) {
        String[][] customerData = {
            {"Rahul Sharma", "+91 9876500001", "rahul.sharma@email.com", "Andheri, Mumbai"},
            {"Priya Patel", "+91 9876500002", "priya.patel@email.com", "Bandra, Mumbai"},
            {"Amit Kumar", "+91 9876500003", "amit.kumar@email.com", "Dadar, Mumbai"},
            {"Sneha Reddy", "+91 9876500004", "sneha.reddy@email.com", "Powai, Mumbai"},
            {"Vikram Singh", "+91 9876500005", "vikram.singh@email.com", "Thane, Maharashtra"},
            {"Ananya Desai", "+91 9876500006", "ananya.desai@email.com", "Juhu, Mumbai"},
            {"Rajesh Nair", "+91 9876500007", "rajesh.nair@email.com", "Chembur, Mumbai"},
            {"Kavitha Iyer", "+91 9876500008", "kavitha.iyer@email.com", "Goregaon, Mumbai"},
        };

        for (String[] data : customerData) {
            Customer customer = new Customer();
            customer.setStoreId(storeId);
            customer.setName(data[0]);
            customer.setPhone(data[1]);
            customer.setEmail(data[2]);
            customer.setAddress(data[3]);
            customer.setLoyaltyPoints((int)(Math.random() * 500));
            customer.setVisitCount((int)(Math.random() * 20) + 1);
            customer.setTotalPurchases(BigDecimal.valueOf(Math.random() * 10000));
            customer.setActive(true);
            customerRepository.save(customer);
        }
    }
}
