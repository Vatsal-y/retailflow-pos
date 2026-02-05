package com.retailflow.pos.repository;

import com.retailflow.pos.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    
    List<Refund> findByOrderId(Long orderId);
    
    List<Refund> findByProcessedBy(Long processedBy);
    
    List<Refund> findByStatus(Refund.Status status);
}
