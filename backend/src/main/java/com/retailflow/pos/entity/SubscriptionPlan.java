package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(name = "max_branches", nullable = false)
    private Integer maxBranches;
    
    @Column(name = "max_users", nullable = false)
    private Integer maxUsers;
    
    @Column(name = "max_products", nullable = false)
    private Integer maxProducts;
    
    @Column(columnDefinition = "TEXT")
    private String features;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    private String description;
}
