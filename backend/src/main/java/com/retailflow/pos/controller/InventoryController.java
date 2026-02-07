package com.retailflow.pos.controller;

import com.retailflow.pos.entity.Branch;
import com.retailflow.pos.entity.Inventory;
import com.retailflow.pos.repository.BranchRepository;
import com.retailflow.pos.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {
    
    private final InventoryRepository inventoryRepository;
    private final BranchRepository branchRepository;
    
    // Note: GET /inventory is handled by GeneralController
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Map<String, Object>>> getProductInventory(@PathVariable Long productId) {
        List<Inventory> inventories = inventoryRepository.findByProductId(productId);
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Inventory inv : inventories) {
            Map<String, Object> item = new HashMap<>();
            item.put("inventoryId", inv.getId());
            item.put("branchId", inv.getBranchId());
            item.put("quantity", inv.getQuantity());
            item.put("reorderLevel", inv.getReorderLevel());
            
            branchRepository.findById(inv.getBranchId()).ifPresent(branch -> {
                item.put("branchName", branch.getName());
            });
            
            result.add(item);
        }
        
        return ResponseEntity.ok(result);
    }
    
    // Note: PUT /inventory/{id} is handled by GeneralController
}
