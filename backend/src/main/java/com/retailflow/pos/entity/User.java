package com.retailflow.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String fullName;
    
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Column(name = "store_id")
    private Long storeId;
    
    @Column(name = "branch_id")
    private Long branchId;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    public enum Role {
        SUPER_ADMIN,
        STORE_ADMIN,
        BRANCH_MANAGER,
        CASHIER
    }
}
