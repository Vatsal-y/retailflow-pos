package com.retailflow.pos.service;

import com.retailflow.pos.entity.*;
import com.retailflow.pos.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportsService {
    
    private final OrderRepository orderRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ShiftReportRepository shiftReportRepository;
    
    // Get branches to analyze - either specific branch or all branches for store
    private List<Branch> getBranchesToAnalyze(Long storeId, Long branchId) {
        if (branchId != null) {
            return branchRepository.findById(branchId)
                    .map(List::of)
                    .orElse(Collections.emptyList());
        }
        return branchRepository.findByStoreId(storeId);
    }
    
    // Top selling products
    public List<Map<String, Object>> getTopProducts(Long storeId, Long branchId, int limit) {
        List<Branch> branches = getBranchesToAnalyze(storeId, branchId);
        Map<Long, Integer> productSales = new HashMap<>();
        Map<Long, BigDecimal> productRevenue = new HashMap<>();
        
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        
        for (Branch branch : branches) {
            List<Order> orders = orderRepository.findByBranchIdAndCreatedAtBetween(
                    branch.getId(), startDate, LocalDateTime.now());
            
            for (Order order : orders) {
                if (order.getItems() != null) {
                    for (OrderItem item : order.getItems()) {
                        productSales.merge(item.getProductId(), item.getQuantity(), Integer::sum);
                        productRevenue.merge(item.getProductId(), item.getTotalPrice(), BigDecimal::add);
                    }
                }
            }
        }
        
        return productSales.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> {
                    Map<String, Object> product = new HashMap<>();
                    Product p = productRepository.findById(entry.getKey()).orElse(null);
                    product.put("productId", entry.getKey());
                    product.put("productName", p != null ? p.getName() : "Unknown");
                    product.put("quantitySold", entry.getValue());
                    product.put("revenue", productRevenue.getOrDefault(entry.getKey(), BigDecimal.ZERO));
                    return product;
                })
                .collect(Collectors.toList());
    }
    
    // Backward compatibility
    public List<Map<String, Object>> getTopProducts(Long storeId, int limit) {
        return getTopProducts(storeId, null, limit);
    }
    
    // Branch performance comparison
    public List<Map<String, Object>> getBranchPerformance(Long storeId) {
        List<Branch> branches = branchRepository.findByStoreId(storeId);
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        
        return branches.stream().map(branch -> {
            Map<String, Object> performance = new HashMap<>();
            
            BigDecimal totalRevenue = orderRepository.calculateTotalSales(
                    branch.getId(), startDate, LocalDateTime.now());
            Long orderCount = orderRepository.countOrdersByBranchAndDate(
                    branch.getId(), startDate, LocalDateTime.now());
            
            performance.put("branchId", branch.getId());
            performance.put("branchName", branch.getName());
            performance.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
            performance.put("orderCount", orderCount != null ? orderCount : 0);
            
            return performance;
        }).collect(Collectors.toList());
    }
    
    // Employee/cashier performance
    public List<Map<String, Object>> getEmployeePerformance(Long storeId, Long branchId) {
        List<Branch> branches = getBranchesToAnalyze(storeId, branchId);
        Map<Long, BigDecimal> employeeRevenue = new HashMap<>();
        Map<Long, Integer> employeeOrders = new HashMap<>();
        Map<Long, Integer> employeeShifts = new HashMap<>();
        
        for (Branch branch : branches) {
            List<ShiftReport> shifts = shiftReportRepository.findByBranchId(branch.getId());
            
            for (ShiftReport shift : shifts) {
                employeeShifts.merge(shift.getCashierId(), 1, Integer::sum);
                if (shift.getTotalSales() != null) {
                    employeeRevenue.merge(shift.getCashierId(), shift.getTotalSales(), BigDecimal::add);
                }
                if (shift.getOrdersCount() != null) {
                    employeeOrders.merge(shift.getCashierId(), shift.getOrdersCount(), Integer::sum);
                }
            }
        }
        
        return employeeRevenue.entrySet().stream()
                .sorted(Map.Entry.<Long, BigDecimal>comparingByValue().reversed())
                .map(entry -> {
                    Map<String, Object> emp = new HashMap<>();
                    User user = userRepository.findById(entry.getKey()).orElse(null);
                    emp.put("employeeId", entry.getKey());
                    emp.put("employeeName", user != null ? user.getFullName() : "Unknown");
                    emp.put("totalRevenue", entry.getValue());
                    emp.put("totalOrders", employeeOrders.getOrDefault(entry.getKey(), 0));
                    emp.put("totalShifts", employeeShifts.getOrDefault(entry.getKey(), 0));
                    return emp;
                })
                .collect(Collectors.toList());
    }
    
    // Backward compatibility
    public List<Map<String, Object>> getEmployeePerformance(Long storeId) {
        return getEmployeePerformance(storeId, null);
    }
    
    // Sales by category
    public List<Map<String, Object>> getSalesByCategory(Long storeId, Long branchId) {
        List<Branch> branches = getBranchesToAnalyze(storeId, branchId);
        Map<Long, BigDecimal> categoryRevenue = new HashMap<>();
        
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        
        for (Branch branch : branches) {
            List<Order> orders = orderRepository.findByBranchIdAndCreatedAtBetween(
                    branch.getId(), startDate, LocalDateTime.now());
            
            for (Order order : orders) {
                if (order.getItems() != null) {
                    for (OrderItem item : order.getItems()) {
                        Product product = productRepository.findById(item.getProductId()).orElse(null);
                        if (product != null && product.getCategoryId() != null) {
                            categoryRevenue.merge(product.getCategoryId(), item.getTotalPrice(), BigDecimal::add);
                        }
                    }
                }
            }
        }
        
        return categoryRevenue.entrySet().stream()
                .sorted(Map.Entry.<Long, BigDecimal>comparingByValue().reversed())
                .map(entry -> {
                    Map<String, Object> cat = new HashMap<>();
                    Category category = categoryRepository.findById(entry.getKey()).orElse(null);
                    cat.put("categoryId", entry.getKey());
                    cat.put("categoryName", category != null ? category.getName() : "Uncategorized");
                    cat.put("revenue", entry.getValue());
                    return cat;
                })
                .collect(Collectors.toList());
    }
    
    // Backward compatibility
    public List<Map<String, Object>> getSalesByCategory(Long storeId) {
        return getSalesByCategory(storeId, null);
    }
    
    // Payment method distribution
    public List<Map<String, Object>> getPaymentMethodDistribution(Long storeId, Long branchId) {
        List<Branch> branches = getBranchesToAnalyze(storeId, branchId);
        Map<String, BigDecimal> methodRevenue = new HashMap<>();
        Map<String, Integer> methodCount = new HashMap<>();
        
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        
        for (Branch branch : branches) {
            List<Order> orders = orderRepository.findByBranchIdAndCreatedAtBetween(
                    branch.getId(), startDate, LocalDateTime.now());
            
            for (Order order : orders) {
                String method = order.getPaymentMethod().name();
                methodRevenue.merge(method, order.getTotalAmount(), BigDecimal::add);
                methodCount.merge(method, 1, Integer::sum);
            }
        }
        
        return methodRevenue.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> pm = new HashMap<>();
                    pm.put("method", entry.getKey());
                    pm.put("revenue", entry.getValue());
                    pm.put("count", methodCount.getOrDefault(entry.getKey(), 0));
                    return pm;
                })
                .collect(Collectors.toList());
    }
    
    // Backward compatibility
    public List<Map<String, Object>> getPaymentMethodDistribution(Long storeId) {
        return getPaymentMethodDistribution(storeId, null);
    }
    
    // Revenue trend over time
    public List<Map<String, Object>> getRevenueTrend(Long storeId, Long branchId, int days) {
        List<Branch> branches = getBranchesToAnalyze(storeId, branchId);
        List<Map<String, Object>> trend = new ArrayList<>();
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDateTime dayStart = LocalDateTime.now().minusDays(i).with(LocalTime.MIN);
            LocalDateTime dayEnd = LocalDateTime.now().minusDays(i).with(LocalTime.MAX);
            
            BigDecimal totalRevenue = BigDecimal.ZERO;
            Long totalOrders = 0L;
            
            for (Branch branch : branches) {
                BigDecimal branchRevenue = orderRepository.calculateTotalSales(branch.getId(), dayStart, dayEnd);
                Long branchOrders = orderRepository.countOrdersByBranchAndDate(branch.getId(), dayStart, dayEnd);
                
                if (branchRevenue != null) totalRevenue = totalRevenue.add(branchRevenue);
                if (branchOrders != null) totalOrders += branchOrders;
            }
            
            Map<String, Object> day = new HashMap<>();
            day.put("date", dayStart.toLocalDate().toString());
            day.put("revenue", totalRevenue);
            day.put("orders", totalOrders);
            trend.add(day);
        }
        
        return trend;
    }
    
    // Backward compatibility
    public List<Map<String, Object>> getRevenueTrend(Long storeId, int days) {
        return getRevenueTrend(storeId, null, days);
    }
}
