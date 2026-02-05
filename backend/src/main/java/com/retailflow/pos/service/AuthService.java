package com.retailflow.pos.service;

import com.retailflow.pos.dto.request.LoginRequest;
import com.retailflow.pos.dto.request.RegisterRequest;
import com.retailflow.pos.dto.response.LoginResponse;
import com.retailflow.pos.entity.User;
import com.retailflow.pos.exception.BusinessException;
import com.retailflow.pos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setStoreId(request.getStoreId());
        user.setBranchId(request.getBranchId());
        user.setActive(true);
        
        user = userRepository.save(user);
        
        return generateTokenResponse(user);
    }
    
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Invalid credentials"));
        
        if (!user.getActive()) {
            throw new BusinessException("User account is inactive");
        }
        
        return generateTokenResponse(user);
    }
    
    private LoginResponse generateTokenResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId());
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("storeId", user.getStoreId());
        extraClaims.put("branchId", user.getBranchId());
        
        String token = jwtService.generateToken(userDetails, extraClaims);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        
        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .userId(user.getId())
                .storeId(user.getStoreId())
                .branchId(user.getBranchId())
                .build();
    }
}
