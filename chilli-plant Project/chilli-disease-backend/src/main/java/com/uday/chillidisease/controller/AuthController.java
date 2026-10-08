package com.uday.chillidisease.controller;

import com.uday.chillidisease.dto.request.AdminLoginRequest;
import com.uday.chillidisease.dto.request.LoginRequest;
import com.uday.chillidisease.dto.request.RegisterRequest;
import com.uday.chillidisease.dto.response.ApiResponse;
import com.uday.chillidisease.service.AdminService;
import com.uday.chillidisease.service.FarmerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final FarmerService farmerService;
    private final AdminService adminService;

    public AuthController(FarmerService farmerService, AdminService adminService) {
        this.farmerService = farmerService;
        this.adminService = adminService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        ApiResponse response = farmerService.register(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> farmerLogin(@Valid @RequestBody LoginRequest request) {
        ApiResponse response = farmerService.login(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        ApiResponse response = adminService.adminLogin(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}