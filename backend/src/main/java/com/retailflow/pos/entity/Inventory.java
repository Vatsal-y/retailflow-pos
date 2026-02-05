package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "inventory")
public class Inventory extends BaseEntity {
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "branch_id", nullable = false)
    private Long branchId;
    
    @Column(nullable = false)
    private Integer quantity = 0;
    
    @Column(name = "reorder_level")
    private Integer reorderLevel = 10;
    
    @Column(name = "max_stock_level")
    private Integer maxStockLevel;
    
    @Transient
    public boolean isLowStock() {
        return quantity <= reorderLevel;
    }
}
