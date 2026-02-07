package com.retailflow.pos.dto.response;

import com.retailflow.pos.entity.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long branchId;
    private String branchName;
    private Long customerId;
    private String customerName;
    private Long cashierId;
    private String cashierName;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    
    @Data
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
    }
    
    public static OrderResponse fromOrder(
            Order order,
            String branchName,
            String customerName,
            String cashierName) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setBranchId(order.getBranchId());
        response.setBranchName(branchName);
        response.setCustomerId(order.getCustomerId());
        response.setCustomerName(customerName);
        response.setCashierId(order.getCashierId());
        response.setCashierName(cashierName);
        response.setSubtotal(order.getSubtotal());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setTaxAmount(order.getTaxAmount());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentMethod(order.getPaymentMethod().name());
        response.setStatus(order.getStatus().name());
        response.setCreatedAt(order.getCreatedAt());
        
        if (order.getItems() != null) {
            response.setItems(order.getItems().stream().map(item -> {
                OrderItemResponse itemResponse = new OrderItemResponse();
                itemResponse.setId(item.getId());
                itemResponse.setProductId(item.getProductId());
                itemResponse.setProductName(item.getProductName());
                itemResponse.setQuantity(item.getQuantity());
                itemResponse.setUnitPrice(item.getUnitPrice());
                itemResponse.setTotalPrice(item.getTotalPrice());
                return itemResponse;
            }).toList());
        }
        
        return response;
    }
}
