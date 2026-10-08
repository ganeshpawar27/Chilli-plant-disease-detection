package com.uday.chillidisease.service.impl;

import com.uday.chillidisease.dto.request.AdminLoginRequest;
import com.uday.chillidisease.dto.response.ApiResponse;
import com.uday.chillidisease.dto.response.DiseaseAnalyticsResponse;
import com.uday.chillidisease.dto.response.FarmerListResponse;
import com.uday.chillidisease.entity.Admin;
import com.uday.chillidisease.entity.Farmer;
import com.uday.chillidisease.repository.AdminRepository;
import com.uday.chillidisease.repository.FarmerRepository;
import com.uday.chillidisease.repository.PredictionRepository;
import com.uday.chillidisease.security.JwtUtil;
import com.uday.chillidisease.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final FarmerRepository farmerRepository;
    private final PredictionRepository predictionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AdminServiceImpl(AdminRepository adminRepository,
                            FarmerRepository farmerRepository,
                            PredictionRepository predictionRepository,
                            PasswordEncoder passwordEncoder,
                            JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.farmerRepository = farmerRepository;
        this.predictionRepository = predictionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public ApiResponse adminLogin(AdminLoginRequest request) {
        var adminOpt = adminRepository.findByUsername(request.getUsername());

        if (adminOpt.isEmpty()) {
            return new ApiResponse(false, "Invalid credentials");
        }

        Admin admin = adminOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            return new ApiResponse(false, "Invalid credentials");
        }

        String token = jwtUtil.generateToken(admin.getUsername(), admin.getRole());

        Map<String, Object> data = new HashMap<>();
        data.put("id", admin.getId());
        data.put("username", admin.getUsername());
        data.put("role", admin.getRole());
        data.put("token", token);

        return new ApiResponse(true, "Admin login successful", data);
    }

    @Override
    public Page<FarmerListResponse> getAllFarmers(Pageable pageable) {
        Page<Farmer> farmers = farmerRepository.findAll(pageable);

        return farmers.map(farmer -> {
            long totalPredictions = predictionRepository.countByFarmerId(farmer.getId());
            return new FarmerListResponse(
                    farmer.getId(),
                    farmer.getName(),
                    farmer.getEmail(),
                    farmer.getPhone(),
                    farmer.getVillage(),
                    farmer.getCreatedAt(),
                    totalPredictions
            );
        });
    }

    @Override
    public ApiResponse deleteFarmer(Long farmerId) {
        if (!farmerRepository.existsById(farmerId)) {
            return new ApiResponse(false, "Farmer not found");
        }

        farmerRepository.deleteById(farmerId);
        return new ApiResponse(true, "Farmer deleted successfully");
    }

    @Override
    public DiseaseAnalyticsResponse getDashboardAnalytics() {
        List<Map<String, Object>> diseaseDistribution =
                predictionRepository.countByDiseaseGroup();
        List<Map<String, Object>> growthStageDistribution =
                predictionRepository.countByGrowthStageGroup();
        List<Map<String, Object>> severityDistribution =
                predictionRepository.countBySeverityGroup();
        List<Map<String, Object>> dailyPredictions =
                predictionRepository.countByDateGroup();

        long totalPredictions = predictionRepository.count();
        long totalFarmers = farmerRepository.count();

        // Find most common disease
        String mostCommonDisease = "None";
        long maxCount = 0;
        for (Map<String, Object> entry : diseaseDistribution) {
            long count = ((Number) entry.get("count")).longValue();
            if (count > maxCount) {
                maxCount = count;
                mostCommonDisease = (String) entry.get("disease");
            }
        }

        // Today's predictions
        long todayPredictions = dailyPredictions.stream()
                .filter(entry -> entry.get("date").toString().equals(LocalDate.now().toString()))
                .mapToLong(entry -> ((Number) entry.get("count")).longValue())
                .sum();

        return new DiseaseAnalyticsResponse(
                diseaseDistribution,
                growthStageDistribution,
                severityDistribution,
                dailyPredictions,
                totalPredictions,
                totalFarmers,
                mostCommonDisease,
                todayPredictions
        );
    }

    @Override
    public Map<String, Object> getBasicAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalFarmers", farmerRepository.count());
        analytics.put("totalPredictions", predictionRepository.count());
        return analytics;
    }
}