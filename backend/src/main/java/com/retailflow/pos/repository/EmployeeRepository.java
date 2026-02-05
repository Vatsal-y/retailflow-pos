package com.retailflow.pos.repository;

import com.retailflow.pos.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    List<Employee> findByBranchId(Long branchId);
    
    List<Employee> findByBranchIdAndStatus(Long branchId, Employee.Status status);
    
    List<Employee> findByUserId(Long userId);
}
