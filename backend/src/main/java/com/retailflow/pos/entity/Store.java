package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "stores")
public class Store extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "owner_id", nullable = false)
    private Long ownerId;
    
    @ManyToOne
    @JoinColumn(name = "subscription_plan_id")
    private SubscriptionPlan subscriptionPlan;
    
    private String address;
    
    private String phone;
    
    private String email;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;
    
    @Column(name = "branch_count")
    private Integer branchCount = 0;
    
    @Column(name = "user_count")
    private Integer userCount = 0;
    
    @Column(name = "product_count")
    private Integer productCount = 0;
    
    public enum Status {
        ACTIVE,
        SUSPENDED,
        INACTIVE
    }
}
