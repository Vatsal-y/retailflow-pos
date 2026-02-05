package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "branches")
public class Branch extends BaseEntity {
    
    @Column(name = "store_id", nullable = false)
    private Long storeId;
    
    @Column(nullable = false)
    private String name;
    
    private String address;
    
    private String city;
    
    private String state;
    
    private String zipCode;
    
    private String phone;
    
    private String email;
    
    @Column(name = "manager_id")
    private Long managerId;
    
    @Column(nullable = false)
    private Boolean active = true;
}
