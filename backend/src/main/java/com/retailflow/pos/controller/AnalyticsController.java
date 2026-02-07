package com.retailflow.pos.controller;

import com.retailflow.pos.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    // Branch Analytics
    @GetMapping("/branch/{branchId}/dashboard")
    public ResponseEntity<Map<String, Object>> getBranchDashboard(@PathVariable Long branchId) {
        return ResponseEntity.ok(analyticsService.getBranchDashboard(branchId));
    }
    
    @GetMapping("/branch/{branchId}/sales-trend")
    public ResponseEntity<List<Map<String, Object>>> getSalesTrend(
            @PathVariable Long branchId,
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(analyticsService.getDailySalesTrend(branchId, days));
    }
    
    @GetMapping("/branch/{branchId}/payment-breakdown")
    public ResponseEntity<List<Map<String, Object>>> getPaymentBreakdown(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getPaymentMethodBreakdown(branchId, startDate, endDate));
    }
    
    @GetMapping("/branch/{branchId}/low-stock")
    public ResponseEntity<List<Map<String, Object>>> getLowStockItems(@PathVariable Long branchId) {
        return ResponseEntity.ok(analyticsService.getLowStockItems(branchId));
    }
    
    // Store Analytics
    @GetMapping("/store/{storeId}/dashboard")
    public ResponseEntity<Map<String, Object>> getStoreDashboard(@PathVariable Long storeId) {
        return ResponseEntity.ok(analyticsService.getStoreDashboard(storeId));
    }
    
    @GetMapping("/store/{storeId}/sales-trend")
    public ResponseEntity<List<Map<String, Object>>> getStoreSalesTrend(
            @PathVariable Long storeId,
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(analyticsService.getStoreSalesTrend(storeId, days));
    }
    
    @GetMapping("/store/{storeId}/low-stock")
    public ResponseEntity<List<Map<String, Object>>> getStoreLowStockItems(@PathVariable Long storeId) {
        return ResponseEntity.ok(analyticsService.getStoreLowStockItems(storeId));
    }
}
