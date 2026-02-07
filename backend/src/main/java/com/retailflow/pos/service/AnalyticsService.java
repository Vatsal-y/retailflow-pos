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
        
        LocalDateTime todayStart = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.now().with(LocalTime.MAX);
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        
        BigDecimal todaySales = BigDecimal.ZERO;
        BigDecimal weekSales = BigDecimal.ZERO;
        Long todayOrders = 0L;
        Long lowStockCount = 0L;
        
        for (Branch branch : branches) {
            // Today's sales
            BigDecimal branchTodaySales = orderRepository.calculateTotalSales(branch.getId(), todayStart, todayEnd);
            if (branchTodaySales != null) {
                todaySales = todaySales.add(branchTodaySales);
            }
            
            // Week's sales
            BigDecimal branchWeekSales = orderRepository.calculateTotalSales(branch.getId(), weekStart, todayEnd);
            if (branchWeekSales != null) {
                weekSales = weekSales.add(branchWeekSales);
            }
            
            // Today's orders
            Long branchTodayOrders = orderRepository.countOrdersByBranchAndDate(branch.getId(), todayStart, todayEnd);
            if (branchTodayOrders != null) {
                todayOrders += branchTodayOrders;
            }
            
            // Low stock
            Long branchLowStock = inventoryRepository.countByBranchIdAndQuantityLessThanEqual(branch.getId(), 10);
            if (branchLowStock != null) {
                lowStockCount += branchLowStock;
            }
        }
        
        dashboard.put("todaySales", todaySales);
        dashboard.put("weekSales", weekSales);
        dashboard.put("todayOrders", todayOrders);
        dashboard.put("lowStockCount", lowStockCount);
        
        return dashboard;
    }
    
    public List<Map<String, Object>> getStoreSalesTrend(Long storeId, int days) {
        List<Map<String, Object>> trend = new ArrayList<>();
        List<Branch> branches = branchRepository.findByStoreId(storeId);
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDateTime dayStart = LocalDateTime.now().minusDays(i).with(LocalTime.MIN);
            LocalDateTime dayEnd = LocalDateTime.now().minusDays(i).with(LocalTime.MAX);
            
            BigDecimal totalSales = BigDecimal.ZERO;
            
            // Aggregate sales from all branches for this day
            for (Branch branch : branches) {
                BigDecimal branchSales = orderRepository.calculateTotalSales(branch.getId(), dayStart, dayEnd);
                if (branchSales != null) {
                    totalSales = totalSales.add(branchSales);
                }
            }
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", dayStart.toLocalDate().toString());
            dayData.put("sales", totalSales);
            trend.add(dayData);
        }
        
        return trend;
    }
    
    public List<Map<String, Object>> getStoreLowStockItems(Long storeId) {
        List<Map<String, Object>> allLowStock = new ArrayList<>();
        List<Branch> branches = branchRepository.findByStoreId(storeId);
        
        for (Branch branch : branches) {
            List<Inventory> lowStock = inventoryRepository.findLowStockItems(branch.getId());
            
            for (Inventory inv : lowStock) {
                Map<String, Object> item = new HashMap<>();
                item.put("inventoryId", inv.getId());
                item.put("productId", inv.getProductId());
                item.put("branchId", branch.getId());
                item.put("branchName", branch.getName());
                item.put("currentStock", inv.getQuantity());
                item.put("reorderLevel", inv.getReorderLevel());
                
                productRepository.findById(inv.getProductId()).ifPresent(product -> {
                    item.put("productName", product.getName());
                    item.put("sku", product.getSku());
                });
                
                allLowStock.add(item);
            }
        }
        
        // Sort by stock level ascending (most critical first)
        allLowStock.sort((a, b) -> {
            Integer stockA = (Integer) a.get("currentStock");
            Integer stockB = (Integer) b.get("currentStock");
            return stockA.compareTo(stockB);
        });
        
        return allLowStock;
    }
}
