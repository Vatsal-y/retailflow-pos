package com.retailflow.pos.controller;

import com.retailflow.pos.entity.*;
import com.retailflow.pos.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Combined controller for simpler entities to speed up implementation
@RestController
@RequiredArgsConstructor
public class GeneralController {
    
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final CategoryRepository categoryRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final InventoryRepository inventoryRepository;
    private final RefundRepository refundRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    
    // Store Management
    @PostMapping("/stores")
    public ResponseEntity<Store> createStore(@RequestBody Store store) {
        return ResponseEntity.ok(storeRepository.save(store));
    }
    
    @GetMapping("/stores")
    public ResponseEntity<List<Store>> getStores() {
        return ResponseEntity.ok(storeRepository.findAll());
    }
    
    @GetMapping("/stores/{id}")
    public ResponseEntity<Store> getStore(@PathVariable Long id) {
        return ResponseEntity.ok(storeRepository.findById(id).orElseThrow());
    }
    
    @PutMapping("/stores/{id}")
    public ResponseEntity<Store> updateStore(@PathVariable Long id, @RequestBody Store store) {
        Store existing = storeRepository.findById(id).orElseThrow();
        existing.setName(store.getName());
        existing.setAddress(store.getAddress());
        existing.setPhone(store.getPhone());
        existing.setEmail(store.getEmail());
        return ResponseEntity.ok(storeRepository.save(existing));
    }
    
    // Branch Management
    @PostMapping("/branches")
    public ResponseEntity<Branch> createBranch(@RequestBody Branch branch) {
        return ResponseEntity.ok(branchRepository.save(branch));
    }
    
    @GetMapping("/branches")
    public ResponseEntity<List<Branch>> getBranches(@RequestParam Long storeId) {
        return ResponseEntity.ok(branchRepository.findByStoreId(storeId));
    }
    
    @GetMapping("/branches/{id}")
    public ResponseEntity<Branch> getBranch(@PathVariable Long id) {
        return ResponseEntity.ok(branchRepository.findById(id).orElseThrow());
    }
    
    @PutMapping("/branches/{id}")
    public ResponseEntity<Branch> updateBranch(@PathVariable Long id, @RequestBody Branch branch) {
        Branch existing = branchRepository.findById(id).orElseThrow();
        existing.setName(branch.getName());
        existing.setAddress(branch.getAddress());
        existing.setPhone(branch.getPhone());
        existing.setActive(branch.getActive());
        return ResponseEntity.ok(branchRepository.save(existing));
    }
    
    // Category Management
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories(@RequestParam Long storeId) {
        return ResponseEntity.ok(categoryRepository.findByStoreId(storeId));
    }
    
    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        Category existing = categoryRepository.findById(id).orElseThrow();
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        return ResponseEntity.ok(categoryRepository.save(existing));
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    // Customer Management
    @PostMapping("/customers")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(customerRepository.save(customer));
    }
    
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getCustomers(@RequestParam Long storeId) {
        return ResponseEntity.ok(customerRepository.findByStoreId(storeId));
    }
    
    @GetMapping("/customers/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerRepository.findById(id).orElseThrow());
    }
    
    @PutMapping("/customers/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        Customer existing = customerRepository.findById(id).orElseThrow();
        existing.setName(customer.getName());
        existing.setPhone(customer.getPhone());
        existing.setEmail(customer.getEmail());
        existing.setAddress(customer.getAddress());
        return ResponseEntity.ok(customerRepository.save(existing));
    }
    
    // Employee Management
    @PostMapping("/employees")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        return ResponseEntity.ok(employeeRepository.save(employee));
    }
    
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getEmployees(@RequestParam Long branchId) {
        return ResponseEntity.ok(employeeRepository.findByBranchId(branchId));
    }
    
    @PutMapping("/employees/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        Employee existing = employeeRepository.findById(id).orElseThrow();
        existing.setPosition(employee.getPosition());
        existing.setSalary(employee.getSalary());
        existing.setStatus(employee.getStatus());
        return ResponseEntity.ok(employeeRepository.save(existing));
    }
    
    // Inventory Management
    @GetMapping("/inventory")
    public ResponseEntity<List<Inventory>> getInventory(@RequestParam Long branchId) {
        return ResponseEntity.ok(inventoryRepository.findByBranchId(branchId));
    }
    
    @PutMapping("/inventory/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @RequestBody Inventory inventory) {
        Inventory existing = inventoryRepository.findById(id).orElseThrow();
        existing.setQuantity(inventory.getQuantity());
        existing.setReorderLevel(inventory.getReorderLevel());
        return ResponseEntity.ok(inventoryRepository.save(existing));
    }
    
    // Refund Management
    @PostMapping("/refunds")
    public ResponseEntity<Refund> createRefund(@RequestBody Refund refund) {
        return ResponseEntity.ok(refundRepository.save(refund));
    }
    
    @GetMapping("/refunds")
    public ResponseEntity<List<Refund>> getRefunds() {
        return ResponseEntity.ok(refundRepository.findAll());
    }
    
    @PutMapping("/refunds/{id}/approve")
    public ResponseEntity<Refund> approveRefund(@PathVariable Long id, @RequestParam Long approvedBy) {
        Refund refund = refundRepository.findById(id).orElseThrow();
        refund.setStatus(Refund.Status.APPROVED);
        refund.setApprovedBy(approvedBy);
        return ResponseEntity.ok(refundRepository.save(refund));
    }
    
    // Subscription Plans
    @GetMapping("/subscriptions/plans")
    public ResponseEntity<List<SubscriptionPlan>> getSubscriptionPlans() {
        return ResponseEntity.ok(subscriptionPlanRepository.findByActiveTrue());
    }
    
    @GetMapping("/subscriptions/plans/{id}")
    public ResponseEntity<SubscriptionPlan> getSubscriptionPlan(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionPlanRepository.findById(id).orElseThrow());
    }
}
