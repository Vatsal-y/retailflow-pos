package com.retailflow.pos.service;

import com.retailflow.pos.entity.*;
import com.retailflow.pos.exception.ResourceNotFoundException;
import com.retailflow.pos.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerRepository customerRepository;
    private final ShiftReportRepository shiftReportRepository;

    @Transactional
    public Order createOrder(Order order) {

        // ✅ Generate unique order number
        order.setOrderNumber("ORD-" + System.currentTimeMillis());

        // ✅ FIX 1: Attach Order into each OrderItem
        for (OrderItem item : order.getItems()) {
            item.setOrder(order);   // 🔥 VERY IMPORTANT
        }

        // ✅ FIX 2: Update inventory - deduct stock
        for (OrderItem item : order.getItems()) {

            Inventory inventory = inventoryRepository
                    .findByProductIdAndBranchId(item.getProductId(), order.getBranchId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Inventory not found for product " + item.getProductId()
                            )
                    );

            // Stock check
            if (inventory.getQuantity() < item.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product " + item.getProductName()
                );
            }

            // Deduct stock
            inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
            inventoryRepository.save(inventory);
        }

        // ✅ Update customer loyalty info if customer exists
        if (order.getCustomerId() != null) {

            Customer customer = customerRepository.findById(order.getCustomerId())
                    .orElse(null);

            if (customer != null) {

                customer.setTotalPurchases(
                        customer.getTotalPurchases().add(order.getTotalAmount())
                );

                customer.setVisitCount(customer.getVisitCount() + 1);

                // Loyalty points: 1 point per ₹100
                int pointsEarned = order.getTotalAmount()
                        .divide(BigDecimal.valueOf(100))
                        .intValue();

                customer.setLoyaltyPoints(customer.getLoyaltyPoints() + pointsEarned);

                customerRepository.save(customer);
            }
        }

        // ✅ Update active shift report if cashier shift is running
        shiftReportRepository.findByCashierIdAndStatus(
                        order.getCashierId(),
                        ShiftReport.Status.ACTIVE
                )
                .ifPresent(shift -> {

                    shift.setTotalSales(
                            shift.getTotalSales().add(order.getTotalAmount())
                    );

                    shift.setOrdersCount(shift.getOrdersCount() + 1);

                    // Payment breakdown
                    switch (order.getPaymentMethod()) {
                        case CASH ->
                                shift.setCashSales(
                                        shift.getCashSales().add(order.getTotalAmount())
                                );

                        case CARD ->
                                shift.setCardSales(
                                        shift.getCardSales().add(order.getTotalAmount())
                                );

                        case UPI ->
                                shift.setUpiSales(
                                        shift.getUpiSales().add(order.getTotalAmount())
                                );

                        case WALLET ->
                                shift.setWalletSales(
                                        shift.getWalletSales().add(order.getTotalAmount())
                                );
                    }

                    shiftReportRepository.save(shift);
                });

        // ✅ Save Order + Items correctly
        return orderRepository.save(order);
    }

    // ------------------- Other Methods -------------------

    public List<Order> getOrdersByBranch(Long branchId) {
        return orderRepository.findByBranchId(branchId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found with id: " + id)
                );
    }

    public List<Order> getOrdersByDateRange(Long branchId,
                                           LocalDateTime startDate,
                                           LocalDateTime endDate) {

        return orderRepository.findByBranchIdAndCreatedAtBetween(
                branchId, startDate, endDate
        );
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getOrdersWithFilters(Long branchId,
                                           Long customerId,
                                           LocalDateTime startDate,
                                           LocalDateTime endDate,
                                           Order.Status status,
                                           Order.PaymentMethod paymentMethod) {

        List<Order> orders = orderRepository.findByBranchId(branchId);

        return orders.stream()
                .filter(order -> customerId == null || order.getCustomerId().equals(customerId))
                .filter(order -> startDate == null || order.getCreatedAt().isAfter(startDate))
                .filter(order -> endDate == null || order.getCreatedAt().isBefore(endDate))
                .filter(order -> status == null || order.getStatus().equals(status))
                .filter(order -> paymentMethod == null || order.getPaymentMethod().equals(paymentMethod))
                .collect(Collectors.toList());
    }
}
