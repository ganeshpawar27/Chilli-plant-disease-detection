package com.uday.chillidisease.controller;

import com.uday.chillidisease.dto.response.ApiResponse;
import com.uday.chillidisease.dto.response.DiseaseAnalyticsResponse;
import com.uday.chillidisease.dto.response.FarmerListResponse;
import com.uday.chillidisease.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/farmers")
    public ResponseEntity<Page<FarmerListResponse>> getAllFarmers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {

        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(adminService.getAllFarmers(pageable));
    }

    @DeleteMapping("/farmer/{id}")
    public ResponseEntity<ApiResponse> deleteFarmer(@PathVariable Long id) {
        ApiResponse response = adminService.deleteFarmer(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<DiseaseAnalyticsResponse> getDashboardAnalytics() {
        return ResponseEntity.ok(adminService.getDashboardAnalytics());
    }

    @GetMapping("/analytics/basic")
    public ResponseEntity<Map<String, Object>> getBasicAnalytics() {
        return ResponseEntity.ok(adminService.getBasicAnalytics());
    }
}