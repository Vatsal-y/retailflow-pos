package com.retailflow.pos.controller;

import com.retailflow.pos.entity.Order;
import com.retailflow.pos.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }
    
    @GetMapping
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Order.Status status,
            @RequestParam(required = false) Order.PaymentMethod paymentMethod) {
        
        // If customer ID is provided, get customer orders
        if (customerId != null && branchId == null) {
            return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
        }
        
        // If branch ID is provided with filters
        if (branchId != null && (customerId != null || startDate != null || endDate != null || status != null || paymentMethod != null)) {
            return ResponseEntity.ok(orderService.getOrdersWithFilters(branchId, customerId, startDate, endDate, status, paymentMethod));
        }
        
        // Default: get all orders for branch
        if (branchId != null) {
            return ResponseEntity.ok(orderService.getOrdersByBranch(branchId));
        }
        
        throw new IllegalArgumentException("Either branchId or customerId must be provided");
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<Order>> getOrderHistory(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(orderService.getOrdersByDateRange(branchId, startDate, endDate));
    }
}
