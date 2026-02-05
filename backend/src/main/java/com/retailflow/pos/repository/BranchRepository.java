package com.retailflow.pos.repository;

import com.retailflow.pos.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    
    List<Branch> findByStoreId(Long storeId);
    
    List<Branch> findByStoreIdAndActive(Long storeId, Boolean active);
    
    Long countByStoreId(Long storeId);
}
