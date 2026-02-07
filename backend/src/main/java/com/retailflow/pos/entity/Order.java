package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    
    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;
    
    @Column(name = "branch_id", nullable = false)
    private Long branchId;
    
    @Column(name = "customer_id")
    private Long customerId;
    
    @Column(name = "cashier_id", nullable = false)
    private Long cashierId;
    
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonManagedReference
private List<OrderItem> items = new ArrayList<>();

    
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage = BigDecimal.ZERO;
    
    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.COMPLETED;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "points_redeemed")
    private Integer pointsRedeemed = 0;
    
    @Column(name = "points_earned")
    private Integer pointsEarned = 0;
    
    public enum PaymentMethod {
        CASH,
        CARD,
        UPI,
        WALLET
    }
    
    public enum Status {
        PENDING,
        COMPLETED,
        CANCELLED,
        REFUNDED
    }
}
