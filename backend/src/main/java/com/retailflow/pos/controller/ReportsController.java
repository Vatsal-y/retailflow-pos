package com.retailflow.pos.controller;

import com.retailflow.pos.service.ReportsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportsController {
    
    private final ReportsService reportsService;
    
    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts(
            @RequestParam Long storeId,
            @RequestParam(required = false) Long branchId,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(reportsService.getTopProducts(storeId, branchId, limit));
    }
    
    @GetMapping("/branch-performance")
    public ResponseEntity<List<Map<String, Object>>> getBranchPerformance(@RequestParam Long storeId) {
        return ResponseEntity.ok(reportsService.getBranchPerformance(storeId));
    }
    
    @GetMapping("/employee-performance")
    public ResponseEntity<List<Map<String, Object>>> getEmployeePerformance(
            @RequestParam Long storeId,
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(reportsService.getEmployeePerformance(storeId, branchId));
    }
    
    @GetMapping("/sales-by-category")
    public ResponseEntity<List<Map<String, Object>>> getSalesByCategory(
            @RequestParam Long storeId,
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(reportsService.getSalesByCategory(storeId, branchId));
    }
    
    @GetMapping("/payment-methods")
    public ResponseEntity<List<Map<String, Object>>> getPaymentMethodDistribution(
            @RequestParam Long storeId,
            @RequestParam(required = false) Long branchId) {
        return ResponseEntity.ok(reportsService.getPaymentMethodDistribution(storeId, branchId));
    }
    
    @GetMapping("/revenue-trend")
    public ResponseEntity<List<Map<String, Object>>> getRevenueTrend(
            @RequestParam Long storeId,
            @RequestParam(required = false) Long branchId,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(reportsService.getRevenueTrend(storeId, branchId, days));
    }
}
