package com.uday.chillidisease.service;

import com.uday.chillidisease.dto.request.AdminLoginRequest;
import com.uday.chillidisease.dto.response.ApiResponse;
import com.uday.chillidisease.dto.response.DiseaseAnalyticsResponse;
import com.uday.chillidisease.dto.response.FarmerListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AdminService {
    ApiResponse adminLogin(AdminLoginRequest request);
    Page<FarmerListResponse> getAllFarmers(Pageable pageable);
    ApiResponse deleteFarmer(Long farmerId);
    DiseaseAnalyticsResponse getDashboardAnalytics();
    Map<String, Object> getBasicAnalytics();
}