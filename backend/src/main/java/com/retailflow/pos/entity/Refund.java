package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "refunds")
public class Refund extends BaseEntity {
    
    @Column(name = "order_id", nullable = false)
    private Long orderId;
    
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;
    
    @Column(name = "processed_by", nullable = false)
    private Long processedBy;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;
    
    @Column(name = "approved_by")
    private Long approvedBy;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    public enum Status {
        PENDING,
        APPROVED,
        REJECTED,
        COMPLETED
    }
}
