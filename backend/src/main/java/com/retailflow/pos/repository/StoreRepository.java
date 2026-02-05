package com.retailflow.pos.repository;

import com.retailflow.pos.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    
    List<Store> findByOwnerId(Long ownerId);
    
    List<Store> findByStatus(Store.Status status);
}
