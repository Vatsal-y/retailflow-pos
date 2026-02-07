package com.retailflow.pos.dto.response;

import com.retailflow.pos.entity.Employee;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeResponse {
    private Long id;
    private Long branchId;
    private Long userId;
    private String position;
    private BigDecimal salary;
    private LocalDate hireDate;
    private String status;
    private String notes;
    private UserInfo user;
    
    @Data
    public static class UserInfo {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private String phone;
    }
    
    public static EmployeeResponse fromEmployee(Employee emp, com.retailflow.pos.entity.User user) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(emp.getId());
        response.setBranchId(emp.getBranchId());
        response.setUserId(emp.getUserId());
        response.setPosition(emp.getPosition());
        response.setSalary(emp.getSalary());
        response.setHireDate(emp.getHireDate());
        response.setStatus(emp.getStatus().name());
        response.setNotes(emp.getNotes());
        
        if (user != null) {
            UserInfo userInfo = new UserInfo();
            userInfo.setId(user.getId());
            userInfo.setFullName(user.getFullName());
            userInfo.setEmail(user.getEmail());
            userInfo.setRole(user.getRole().name());
            userInfo.setPhone(user.getPhone());
            response.setUser(userInfo);
        }
        
        return response;
    }
}
