package com.uday.chillidisease.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "predicted_disease")
    private String predictedDisease;

    @Column
    private Double confidence;

    @Column(name = "severity")
    private String severity;

    @Column(name = "growth_stage")
    private String growthStage;

    @Column(name = "growth_confidence")
    private Double growthConfidence;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String cause;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(columnDefinition = "TEXT")
    private String pesticide;

    @Column(name = "organic_treatment", columnDefinition = "TEXT")
    private String organicTreatment;

    @Column(columnDefinition = "TEXT")
    private String prevention;

    @Column(name = "prediction_time")
    private LocalDateTime predictionTime;

    @PrePersist
    protected void onCreate() {
        predictionTime = LocalDateTime.now();
    }
}