package com.retailflow.pos.dto.response;

import com.retailflow.pos.entity.ShiftReport;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ShiftReportResponse {
    private Long id;
    private Long branchId;
    private String branchName;
    private Long cashierId;
    private String cashierName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal totalSales;
    private Integer ordersCount;
    private BigDecimal cashSales;
    private BigDecimal cardSales;
    private BigDecimal upiSales;
    private BigDecimal walletSales;
    private Integer refundsCount;
    private BigDecimal refundsAmount;
    private String status;
    private List<OrderSummary> orders;
    
    @Data
    public static class OrderSummary {
        private Long id;
        private String orderNumber;
        private BigDecimal totalAmount;
        private String paymentMethod;
        private String customerName;
        private LocalDateTime createdAt;
    }
    
    public static ShiftReportResponse fromShiftReport(
            ShiftReport shift, 
            String branchName,
            String cashierName,
            List<OrderSummary> orders) {
        ShiftReportResponse response = new ShiftReportResponse();
        response.setId(shift.getId());
        response.setBranchId(shift.getBranchId());
        response.setBranchName(branchName);
        response.setCashierId(shift.getCashierId());
        response.setCashierName(cashierName);
        response.setStartTime(shift.getStartTime());
        response.setEndTime(shift.getEndTime());
        response.setTotalSales(shift.getTotalSales());
        response.setOrdersCount(shift.getOrdersCount());
        response.setCashSales(shift.getCashSales());
        response.setCardSales(shift.getCardSales());
        response.setUpiSales(shift.getUpiSales());
        response.setWalletSales(shift.getWalletSales());
        response.setRefundsCount(shift.getRefundsCount());
        response.setRefundsAmount(shift.getRefundsAmount());
        response.setStatus(shift.getStatus().name());
        response.setOrders(orders);
        return response;
    }
}

