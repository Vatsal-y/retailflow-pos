package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "shift_reports")
public class ShiftReport extends BaseEntity {
    
    @Column(name = "branch_id", nullable = false)
    private Long branchId;
    
    @Column(name = "cashier_id", nullable = false)
    private Long cashierId;
    
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(name = "total_sales", precision = 10, scale = 2)
    private BigDecimal totalSales = BigDecimal.ZERO;
    
    @Column(name = "cash_sales", precision = 10, scale = 2)
    private BigDecimal cashSales = BigDecimal.ZERO;
    
    @Column(name = "card_sales", precision = 10, scale = 2)
    private BigDecimal cardSales = BigDecimal.ZERO;
    
    @Column(name = "upi_sales", precision = 10, scale = 2)
    private BigDecimal upiSales = BigDecimal.ZERO;
    
    @Column(name = "wallet_sales", precision = 10, scale = 2)
    private BigDecimal walletSales = BigDecimal.ZERO;
    
    @Column(name = "orders_count")
    private Integer ordersCount = 0;
    
    @Column(name = "refunds_count")
    private Integer refundsCount = 0;
    
    @Column(name = "refunds_amount", precision = 10, scale = 2)
    private BigDecimal refundsAmount = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;
    
    public enum Status {
        ACTIVE,
        CLOSED
    }
}
