package com.retailflow.pos.controller;

import com.retailflow.pos.entity.ShiftReport;
import com.retailflow.pos.service.ShiftReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shift-reports")
@RequiredArgsConstructor
public class ShiftReportController {
    
    private final ShiftReportService shiftReportService;
    
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
    public ResponseEntity<List<ShiftReport>> getShiftReports(@RequestParam Long branchId) {
        return ResponseEntity.ok(shiftReportService.getShiftReportsByBranch(branchId));
    }
    
    @GetMapping("/cashier")
    public ResponseEntity<List<ShiftReport>> getShiftReportsByCashier(@RequestParam Long cashierId) {
        return ResponseEntity.ok(shiftReportService.getShiftReportsByCashier(cashierId));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ShiftReport> getActiveShift(@RequestParam Long cashierId) {
        return shiftReportService.getActiveShift(cashierId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
