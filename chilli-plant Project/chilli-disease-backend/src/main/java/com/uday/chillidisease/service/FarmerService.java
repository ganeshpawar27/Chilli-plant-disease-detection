package com.uday.chillidisease.service;

import com.uday.chillidisease.dto.request.LoginRequest;
import com.uday.chillidisease.dto.request.RegisterRequest;
import com.uday.chillidisease.dto.response.ApiResponse;
import com.uday.chillidisease.dto.response.FarmerProfileResponse;
import com.uday.chillidisease.dto.response.PredictionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FarmerService {
    ApiResponse register(RegisterRequest request);
    ApiResponse login(LoginRequest request);
    FarmerProfileResponse getProfile(String email);
    ApiResponse uploadImageForPrediction(String email, MultipartFile file);
    List<PredictionResponse> getPredictionHistory(String email);
    Page<PredictionResponse> getPredictionHistoryPaginated(String email, Pageable pageable);
}