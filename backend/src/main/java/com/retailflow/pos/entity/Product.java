package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "products")
public class Product extends BaseEntity {
    
    @Column(name = "store_id", nullable = false)
    private Long storeId;
    
    @Column(name = "category_id")
    private Long categoryId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true)
    private String sku;
    
    private String barcode;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal costPrice;
    
    private String image;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Enumerated(EnumType.STRING)
    private Unit unit = Unit.PIECE;
    
    public enum Unit {
        PIECE,
        KG,
        GRAM,
        LITER,
        ML
    }
}
