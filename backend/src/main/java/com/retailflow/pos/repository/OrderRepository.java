package com.retailflow.pos.repository;

import com.retailflow.pos.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByBranchId(Long branchId);
    
    Page<Order> findByBranchId(Long branchId, Pageable pageable);
    
    List<Order> findByBranchIdAndCreatedAtBetween(Long branchId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Order> findByCashierId(Long cashierId);
    
    List<Order> findByCustomerId(Long customerId);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.branchId = :branchId AND o.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalSales(@Param("branchId") Long branchId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.branchId = :branchId AND o.createdAt BETWEEN :startDate AND :endDate")
    Long countOrdersByBranchAndDate(@Param("branchId") Long branchId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT o.paymentMethod, SUM(o.totalAmount) FROM Order o WHERE o.branchId = :branchId AND o.createdAt BETWEEN :startDate AND :endDate GROUP BY o.paymentMethod")
    List<Object[]> getPaymentMethodBreakdown(@Param("branchId") Long branchId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
