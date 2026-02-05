package com.retailflow.pos.repository;

import com.retailflow.pos.entity.ShiftReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftReportRepository extends JpaRepository<ShiftReport, Long> {
    
    List<ShiftReport> findByBranchId(Long branchId);
    
    List<ShiftReport> findByCashierId(Long cashierId);
    
    Optional<ShiftReport> findByCashierIdAndStatus(Long cashierId, ShiftReport.Status status);
    
    List<ShiftReport> findByBranchIdAndStatus(Long branchId, ShiftReport.Status status);
}
