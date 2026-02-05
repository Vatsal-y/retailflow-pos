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
public class AnalyticsService {
    
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;
    
    // Branch Analytics
    public Map<String, Object> getBranchDashboard(Long branchId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        LocalDateTime todayStart = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.now().with(LocalTime.MAX);
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        LocalDateTime monthStart = LocalDateTime.now().minusDays(30);
        
        // Today's sales
        BigDecimal todaySales = orderRepository.calculateTotalSales(branchId, todayStart, todayEnd);
        dashboard.put("todaySales", todaySales != null ? todaySales : BigDecimal.ZERO);
        
        // This week's sales
        BigDecimal weekSales = orderRepository.calculateTotalSales(branchId, weekStart, todayEnd);
        dashboard.put("weekSales", weekSales != null ? weekSales : BigDecimal.ZERO);
        
        // Orders count
        Long todayOrders = orderRepository.countOrdersByBranchAndDate(branchId, todayStart, todayEnd);
        dashboard.put("todayOrders", todayOrders != null ? todayOrders : 0);
        
        // Low stock count
        Long lowStockCount = inventoryRepository.countByBranchIdAndQuantityLessThanEqual(branchId, 10);
        dashboard.put("lowStockCount", lowStockCount != null ? lowStockCount : 0);
        
        return dashboard;
    }
    
    public List<Map<String, Object>> getDailySalesTrend(Long branchId, int days) {
        List<Map<String, Object>> trend = new ArrayList<>();
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDateTime dayStart = LocalDateTime.now().minusDays(i).with(LocalTime.MIN);
            LocalDateTime dayEnd = LocalDateTime.now().minusDays(i).with(LocalTime.MAX);
            
            BigDecimal sales = orderRepository.calculateTotalSales(branchId, dayStart, dayEnd);
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", dayStart.toLocalDate().toString());
            dayData.put("sales", sales != null ? sales : BigDecimal.ZERO);
            trend.add(dayData);
        }
        
        return trend;
    }
    
    public List<Map<String, Object>> getPaymentMethodBreakdown(Long branchId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> breakdown = orderRepository.getPaymentMethodBreakdown(branchId, startDate, endDate);
        
        return breakdown.stream()
                .map(row -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("method", row[0].toString());
                    item.put("amount", row[1]);
                    return item;
                })
                .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getLowStockItems(Long branchId) {
        List<Inventory> lowStock = inventoryRepository.findLowStockItems(branchId);
        
        return lowStock.stream()
                .map(inv -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("inventoryId", inv.getId());
                    item.put("productId", inv.getProductId());
                    item.put("quantity", inv.getQuantity());
                    item.put("reorderLevel", inv.getReorderLevel());
                    
                    productRepository.findById(inv.getProductId()).ifPresent(product -> {
                        item.put("productName", product.getName());
                        item.put("sku", product.getSku());
                    });
                    
                    return item;
                })
                .collect(Collectors.toList());
    }
    
    // Store Analytics
    public Map<String, Object> getStoreDashboard(Long storeId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        List<Branch> branches = branchRepository.findByStoreId(storeId);
        dashboard.put("totalBranches", branches.size());
        
        // Aggregate sales across all branches
        LocalDateTime monthStart = LocalDateTime.now().minusDays(30).with(LocalTime.MIN);
        LocalDateTime now = LocalDateTime.now();
        
        BigDecimal totalSales = BigDecimal.ZERO;
        Long totalOrders = 0L;
        
        for (Branch branch : branches) {
            BigDecimal branchSales = orderRepository.calculateTotalSales(branch.getId(), monthStart, now);
            if (branchSales != null) {
                totalSales = totalSales.add(branchSales);
            }
            
            Long branchOrders = orderRepository.countOrdersByBranchAndDate(branch.getId(), monthStart, now);
            if (branchOrders != null) {
                totalOrders += branchOrders;
            }
        }
        
        dashboard.put("totalSales", totalSales);
        dashboard.put("totalOrders", totalOrders);
        dashboard.put("averageOrderValue", totalOrders > 0 ? totalSales.divide(BigDecimal.valueOf(totalOrders), 2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO);
        
        return dashboard;
    }
}
