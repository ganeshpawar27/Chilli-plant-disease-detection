package com.uday.chillidisease.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PredictionResponse {
    private Long id;
    private String imagePath;
    private String predictedDisease;
    private Double confidence;
    private String severity;
    private String growthStage;
    private Double growthConfidence;
    private String description;
    private String cause;
    private String symptoms;
    private String pesticide;
    private String organicTreatment;
    private String prevention;
    private LocalDateTime predictionTime;
}