package com.retailflow.pos.service;

import com.retailflow.pos.entity.ShiftReport;
import com.retailflow.pos.exception.BusinessException;
import com.retailflow.pos.repository.ShiftReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShiftReportService {
    
    private final ShiftReportRepository shiftReportRepository;
    
   public ShiftReport startShift(Long branchId, Long cashierId) {
        // Check if cashier already has an active shift
        shiftReportRepository.findByCashierIdAndStatus(cashierId, ShiftReport.Status.ACTIVE)
                .ifPresent(shift -> {
                    throw new BusinessException("Cashier already has an active shift");
                });
        
        ShiftReport report = new ShiftReport();
        report.setBranchId(branchId);
        report.setCashierId(cashierId);
        report.setStartTime(LocalDateTime.now());
        report.setStatus(ShiftReport.Status.ACTIVE);
        report.setTotalSales(BigDecimal.ZERO);
        report.setCashSales(BigDecimal.ZERO);
        report.setCardSales(BigDecimal.ZERO);
        report.setUpiSales(BigDecimal.ZERO);
        report.setWalletSales(BigDecimal.ZERO);
        report.setOrdersCount(0);
        report.setRefundsCount(0);
        report.setRefundsAmount(BigDecimal.ZERO);
        
        return shiftReportRepository.save(report);
    }
    
    public ShiftReport endShift(Long cashierId) {
        ShiftReport report = shiftReportRepository.findByCashierIdAndStatus(cashierId, ShiftReport.Status.ACTIVE)
                .orElseThrow(() -> new BusinessException("No active shift found for cashier"));
        
        report.setEndTime(LocalDateTime.now());
        report.setStatus(ShiftReport.Status.CLOSED);
        
        return shiftReportRepository.save(report);
    }
    
    public List<ShiftReport> getShiftReportsByBranch(Long branchId) {
        return shiftReportRepository.findByBranchId(branchId);
    }
    
    public List<ShiftReport> getShiftReportsByCashier(Long cashierId) {
        return shiftReportRepository.findByCashierId(cashierId);
    }
    
    public Optional<ShiftReport> getActiveShift(Long cashierId) {
        return shiftReportRepository.findByCashierIdAndStatus(cashierId, ShiftReport.Status.ACTIVE);
    }
}
