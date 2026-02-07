package com.retailflow.pos.controller;

import com.retailflow.pos.dto.response.OrderResponse;
import com.retailflow.pos.entity.Order;
import com.retailflow.pos.repository.BranchRepository;
import com.retailflow.pos.repository.CustomerRepository;
import com.retailflow.pos.repository.UserRepository;
import com.retailflow.pos.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    private final BranchRepository branchRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }
    
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Order.Status status,
            @RequestParam(required = false) Order.PaymentMethod paymentMethod) {
        
        List<Order> orders;
        
        // If customer ID is provided, get customer orders
        if (customerId != null && branchId == null) {
            orders = orderService.getOrdersByCustomer(customerId);
        }
        // If branch ID is provided with filters
        else if (branchId != null && (customerId != null || startDate != null || endDate != null || status != null || paymentMethod != null)) {
            orders = orderService.getOrdersWithFilters(branchId, customerId, startDate, endDate, status, paymentMethod);
        }
        // Default: get all orders for branch
        else if (branchId != null) {
            orders = orderService.getOrdersByBranch(branchId);
        } else {
            throw new IllegalArgumentException("Either branchId or customerId must be provided");
        }
        
        return ResponseEntity.ok(enrichOrders(orders));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(enrichOrder(order));
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<OrderResponse>> getOrderHistory(
            @RequestParam Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Order> orders = orderService.getOrdersByDateRange(branchId, startDate, endDate);
        return ResponseEntity.ok(enrichOrders(orders));
    }
    
    private List<OrderResponse> enrichOrders(List<Order> orders) {
        return orders.stream().map(this::enrichOrder).collect(Collectors.toList());
    }
    
    private OrderResponse enrichOrder(Order order) {
        String branchName = branchRepository.findById(order.getBranchId())
                .map(b -> b.getName()).orElse("Unknown");
        String customerName = order.getCustomerId() != null 
                ? customerRepository.findById(order.getCustomerId()).map(c -> c.getName()).orElse("Walk-in")
                : "Walk-in";
        String cashierName = userRepository.findById(order.getCashierId())
                .map(u -> u.getFullName()).orElse("Unknown");
        
        return OrderResponse.fromOrder(order, branchName, customerName, cashierName);
    }
}

