package com.uday.chillidisease.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class DiseaseAnalyticsResponse {
    private List<Map<String, Object>> diseaseDistribution;
    private List<Map<String, Object>> growthStageDistribution;
    private List<Map<String, Object>> severityDistribution;
    private List<Map<String, Object>> dailyPredictions;
    private long totalPredictions;
    private long totalFarmers;
    private String mostCommonDisease;
    private long todayPredictions;
}