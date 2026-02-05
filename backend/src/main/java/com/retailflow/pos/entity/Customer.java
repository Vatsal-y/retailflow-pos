package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "customers")
public class Customer extends BaseEntity {
    
    @Column(name = "store_id", nullable = false)
    private Long storeId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true)
    private String phone;
    
    private String email;
    
    private String address;
    
    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;
    
    @Column(name = "total_purchases", precision = 10, scale = 2)
    private java.math.BigDecimal totalPurchases = java.math.BigDecimal.ZERO;
    
    @Column(name = "visit_count")
    private Integer visitCount = 0;
    
    @Column(nullable = false)
    private Boolean active = true;
}
