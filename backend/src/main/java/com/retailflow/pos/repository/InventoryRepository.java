package com.retailflow.pos.repository;

import com.retailflow.pos.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    List<Inventory> findByBranchId(Long branchId);
    
    Optional<Inventory> findByProductIdAndBranchId(Long productId, Long branchId);
    
    @Query("SELECT i FROM Inventory i WHERE i.branchId = :branchId AND i.quantity <= i.reorderLevel")
    List<Inventory> findLowStockItems(@Param("branchId") Long branchId);
    
    Long countByBranchIdAndQuantityLessThanEqual(Long branchId, Integer quantity);
}
