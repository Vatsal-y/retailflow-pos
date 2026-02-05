package com.retailflow.pos.repository;

import com.retailflow.pos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByStoreId(Long storeId);
    
    List<User> findByBranchId(Long branchId);
    
    List<User> findByStoreIdAndRole(Long storeId, User.Role role);
    
    List<User> findByBranchIdAndRole(Long branchId, User.Role role);
    
    Boolean existsByEmail(String email);
}
