package com.uday.chillidisease.controller;

import com.uday.chillidisease.dto.response.ApiResponse;
import com.uday.chillidisease.dto.response.FarmerProfileResponse;
import com.uday.chillidisease.dto.response.PredictionResponse;
import com.uday.chillidisease.service.FarmerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/farmer")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FarmerController {

    private final FarmerService farmerService;

    public FarmerController(FarmerService farmerService) {
        this.farmerService = farmerService;
    }

    @GetMapping("/profile")
    public ResponseEntity<FarmerProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(farmerService.getProfile(email));
    }

    @PostMapping("/predict")
    public ResponseEntity<ApiResponse> uploadImageForPrediction(
            @RequestParam("image") MultipartFile file,
            Authentication authentication) {

        String email = authentication.getName();
        System.out.println("🔍 Controller: Received predict request from " + email);

        ApiResponse response = farmerService.uploadImageForPrediction(email, file);

        System.out.println("📤 Controller: Got response: " + response);
        System.out.println("📤 Controller: Success: " + response.isSuccess());

        if (response.isSuccess()) {
            System.out.println("✅ Controller: Returning 200 OK");
            return ResponseEntity.ok(response);
        } else {
            System.out.println("❌ Controller: Returning 400 Bad Request");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPredictionHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String email = authentication.getName();

        if (page >= 0 && size > 0) {
            Pageable pageable = PageRequest.of(page, size);
            return ResponseEntity.ok(farmerService.getPredictionHistoryPaginated(email, pageable));
        } else {
            return ResponseEntity.ok(farmerService.getPredictionHistory(email));
        }
    }
}