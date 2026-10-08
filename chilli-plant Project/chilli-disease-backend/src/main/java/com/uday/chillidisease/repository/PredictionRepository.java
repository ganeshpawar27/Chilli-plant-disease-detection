package com.uday.chillidisease.repository;

import com.uday.chillidisease.entity.Prediction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    List<Prediction> findByFarmerIdOrderByPredictionTimeDesc(Long farmerId);

    Page<Prediction> findByFarmerIdOrderByPredictionTimeDesc(Long farmerId, Pageable pageable);

    List<Prediction> findByFarmerIdAndPredictedDisease(Long farmerId, String disease);

    long countByFarmerId(Long farmerId);

    long countByPredictedDisease(String disease);

    @Query("SELECT p.predictedDisease as disease, COUNT(p) as count " +
            "FROM Prediction p GROUP BY p.predictedDisease")
    List<Map<String, Object>> countByDiseaseGroup();

    @Query("SELECT p.growthStage as stage, COUNT(p) as count " +
            "FROM Prediction p GROUP BY p.growthStage")
    List<Map<String, Object>> countByGrowthStageGroup();

    @Query("SELECT FUNCTION('DATE', p.predictionTime) as date, COUNT(p) as count " +
            "FROM Prediction p GROUP BY FUNCTION('DATE', p.predictionTime) " +
            "ORDER BY FUNCTION('DATE', p.predictionTime)")
    List<Map<String, Object>> countByDateGroup();

    @Query("SELECT p.severity as severity, COUNT(p) as count " +
            "FROM Prediction p GROUP BY p.severity")
    List<Map<String, Object>> countBySeverityGroup();
}