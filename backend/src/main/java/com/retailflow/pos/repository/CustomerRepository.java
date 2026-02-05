package com.retailflow.pos.repository;

import com.retailflow.pos.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    List<Customer> findByStoreId(Long storeId);
    
    Optional<Customer> findByPhone(String phone);
    
    Optional<Customer> findByEmail(String email);
}
