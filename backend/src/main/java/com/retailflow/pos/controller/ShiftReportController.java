package com.retailflow.pos.controller;

import com.retailflow.pos.dto.response.ShiftReportResponse;
import com.retailflow.pos.entity.Order;
import com.retailflow.pos.entity.ShiftReport;
import com.retailflow.pos.repository.BranchRepository;
import com.retailflow.pos.repository.CustomerRepository;
import com.retailflow.pos.repository.OrderRepository;
import com.retailflow.pos.repository.UserRepository;
import com.retailflow.pos.service.ShiftReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shift-reports")
@RequiredArgsConstructor
public class ShiftReportController {
    
    private final ShiftReportService shiftReportService;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    
    @PostMapping("/start")
    public ResponseEntity<ShiftReport> startShift(
            @RequestParam Long branchId,
            @RequestParam Long cashierId) {
        return ResponseEntity.ok(shiftReportService.startShift(branchId, cashierId));
    }
    
    @PostMapping("/end")
    public ResponseEntity<ShiftReport> endShift(@RequestParam Long cashierId) {
        return ResponseEntity.ok(shiftReportService.endShift(cashierId));
    }
    
    @GetMapping
    public ResponseEntity<List<ShiftReportResponse>> getShiftReports(@RequestParam Long branchId) {
        List<ShiftReport> shifts = shiftReportService.getShiftReportsByBranch(branchId);
        return ResponseEntity.ok(enrichShifts(shifts));
    }
    
    @GetMapping("/cashier")
    public ResponseEntity<List<ShiftReportResponse>> getShiftReportsByCashier(@RequestParam Long cashierId) {
        List<ShiftReport> shifts = shiftReportService.getShiftReportsByCashier(cashierId);
        return ResponseEntity.ok(enrichShifts(shifts));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ShiftReport> getActiveShift(@RequestParam Long cashierId) {
        return shiftReportService.getActiveShift(cashierId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
    
    private List<ShiftReportResponse> enrichShifts(List<ShiftReport> shifts) {
        return shifts.stream().map(this::enrichShift).collect(Collectors.toList());
    }
    
    private ShiftReportResponse enrichShift(ShiftReport shift) {
        String branchName = branchRepository.findById(shift.getBranchId())
                .map(b -> b.getName()).orElse("Unknown");
        String cashierName = userRepository.findById(shift.getCashierId())
                .map(u -> u.getFullName()).orElse("Unknown");
        
        // Get orders during this shift's time range
        List<ShiftReportResponse.OrderSummary> orders = new ArrayList<>();
        if (shift.getStartTime() != null) {
            var endTime = shift.getEndTime() != null ? shift.getEndTime() : java.time.LocalDateTime.now();
            List<Order> shiftOrders = orderRepository.findByBranchIdAndCreatedAtBetween(
                    shift.getBranchId(), shift.getStartTime(), endTime);
            
            // Filter to only include orders from this cashier
            orders = shiftOrders.stream()
                    .filter(o -> o.getCashierId().equals(shift.getCashierId()))
                    .map(o -> {
                        ShiftReportResponse.OrderSummary summary = new ShiftReportResponse.OrderSummary();
                        summary.setId(o.getId());
                        summary.setOrderNumber(o.getOrderNumber());
                        summary.setTotalAmount(o.getTotalAmount());
                        summary.setPaymentMethod(o.getPaymentMethod().name());
                        summary.setCustomerName(o.getCustomerId() != null 
                                ? customerRepository.findById(o.getCustomerId()).map(c -> c.getName()).orElse("Walk-in")
                                : "Walk-in");
                        summary.setCreatedAt(o.getCreatedAt());
                        return summary;
                    })
                    .collect(Collectors.toList());
        }
        
        return ShiftReportResponse.fromShiftReport(shift, branchName, cashierName, orders);
    }
}

