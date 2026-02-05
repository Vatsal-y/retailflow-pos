package com.retailflow.pos.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String refreshToken;
    private String email;
    private String fullName;
    private String role;
    private Long userId;
    private Long storeId;
    private Long branchId;
}
