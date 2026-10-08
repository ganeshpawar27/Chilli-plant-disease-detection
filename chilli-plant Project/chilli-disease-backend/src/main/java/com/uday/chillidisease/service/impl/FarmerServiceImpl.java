package com.uday.chillidisease.service.impl;

import com.uday.chillidisease.dto.request.LoginRequest;
import com.uday.chillidisease.dto.request.RegisterRequest;
import com.uday.chillidisease.dto.response.ApiResponse;
import com.uday.chillidisease.dto.response.FarmerProfileResponse;
import com.uday.chillidisease.dto.response.PredictionResponse;
import com.uday.chillidisease.entity.Farmer;
import com.uday.chillidisease.entity.Prediction;
import com.uday.chillidisease.repository.FarmerRepository;
import com.uday.chillidisease.repository.PredictionRepository;
import com.uday.chillidisease.security.JwtUtil;
import com.uday.chillidisease.service.AIServiceClient;
import com.uday.chillidisease.service.FarmerService;
import com.uday.chillidisease.util.FileStorageUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FarmerServiceImpl implements FarmerService {

    private final FarmerRepository farmerRepository;
    private final PredictionRepository predictionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final FileStorageUtil fileStorageUtil;
    private final AIServiceClient aiServiceClient;

    public FarmerServiceImpl(FarmerRepository farmerRepository,
                             PredictionRepository predictionRepository,
                             PasswordEncoder passwordEncoder,
                             JwtUtil jwtUtil,
                             FileStorageUtil fileStorageUtil,
                             AIServiceClient aiServiceClient) {
        this.farmerRepository = farmerRepository;
        this.predictionRepository = predictionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.fileStorageUtil = fileStorageUtil;
        this.aiServiceClient = aiServiceClient;
    }

    @Override
    public ApiResponse register(RegisterRequest request) {
        if (farmerRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email already registered");
        }

        if (farmerRepository.existsByPhone(request.getPhone())) {
            return new ApiResponse(false, "Phone number already registered");
        }

        Farmer farmer = new Farmer();
        farmer.setName(request.getName());
        farmer.setEmail(request.getEmail());
        farmer.setPassword(passwordEncoder.encode(request.getPassword()));
        farmer.setPhone(request.getPhone());
        farmer.setVillage(request.getVillage());

        Farmer savedFarmer = farmerRepository.save(farmer);
        String token = jwtUtil.generateToken(savedFarmer.getEmail(), "ROLE_FARMER");

        Map<String, Object> data = new HashMap<>();
        data.put("id", savedFarmer.getId());
        data.put("name", savedFarmer.getName());
        data.put("email", savedFarmer.getEmail());
        data.put("phone", savedFarmer.getPhone());
        data.put("village", savedFarmer.getVillage());
        data.put("role", savedFarmer.getRole());
        data.put("token", token);

        return new ApiResponse(true, "Registration successful", data);
    }

    @Override
    public ApiResponse login(LoginRequest request) {
        var farmerOpt = farmerRepository.findByEmail(request.getEmail());

        if (farmerOpt.isEmpty()) {
            return new ApiResponse(false, "Invalid email or password");
        }

        Farmer farmer = farmerOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), farmer.getPassword())) {
            return new ApiResponse(false, "Invalid email or password");
        }

        String token = jwtUtil.generateToken(farmer.getEmail(), farmer.getRole());

        Map<String, Object> data = new HashMap<>();
        data.put("id", farmer.getId());
        data.put("name", farmer.getName());
        data.put("email", farmer.getEmail());
        data.put("phone", farmer.getPhone());
        data.put("village", farmer.getVillage());
        data.put("role", farmer.getRole());
        data.put("token", token);

        return new ApiResponse(true, "Login successful", data);
    }

    @Override
    public FarmerProfileResponse getProfile(String email) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        long totalPredictions = predictionRepository.countByFarmerId(farmer.getId());

        return new FarmerProfileResponse(
                farmer.getId(),
                farmer.getName(),
                farmer.getEmail(),
                farmer.getPhone(),
                farmer.getVillage(),
                farmer.getCreatedAt(),
                totalPredictions
        );
    }

    @Override
    @Transactional
    public ApiResponse uploadImageForPrediction(String email, MultipartFile file) {
        System.out.println("🔍 Starting prediction upload...");

        // Validate file
        if (file.isEmpty()) {
            return new ApiResponse(false, "Please select an image to upload");
        }

        // Find farmer
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        try {
            // Save file
            String filename = fileStorageUtil.saveFile(file);
            System.out.println("✅ File saved: " + filename);

            // Get AI prediction
            System.out.println("🤖 Calling AI service...");
            AIServiceClient.PredictionResult aiResult = aiServiceClient.predict(file);
            System.out.println("✅ AI prediction: " + aiResult.getDiseaseClass());

            // Create prediction record
            Prediction prediction = new Prediction();
            prediction.setFarmer(farmer);
            prediction.setImagePath(filename);
            prediction.setPredictedDisease(aiResult.getDiseaseClass());
            prediction.setConfidence(aiResult.getDiseaseConfidence());
            prediction.setSeverity(aiResult.getSeverity());
            prediction.setGrowthStage(aiResult.getGrowthClass());
            prediction.setGrowthConfidence(aiResult.getGrowthConfidence());
            prediction.setDescription(aiResult.getDescription());
            prediction.setCause(aiResult.getCause());
            prediction.setSymptoms(aiResult.getSymptoms());
            prediction.setPesticide(aiResult.getPesticide());
            prediction.setOrganicTreatment(aiResult.getOrganicTreatment());
            prediction.setPrevention(aiResult.getPrevention());

            // Save to database
            Prediction savedPrediction = predictionRepository.save(prediction);
            System.out.println("✅ Saved prediction ID: " + savedPrediction.getId());

            // Build response data
            Map<String, Object> data = new HashMap<>();
            data.put("predictionId", savedPrediction.getId());
            data.put("imagePath", filename);

            // Disease info
            Map<String, Object> diseaseInfo = new HashMap<>();
            diseaseInfo.put("class", aiResult.getDiseaseClass());
            diseaseInfo.put("confidence", aiResult.getDiseaseConfidence());
            diseaseInfo.put("severity", aiResult.getSeverity());
            data.put("disease", diseaseInfo);

            // Growth info
            Map<String, Object> growthInfo = new HashMap<>();
            growthInfo.put("class", aiResult.getGrowthClass());
            growthInfo.put("confidence", aiResult.getGrowthConfidence());
            data.put("growth", growthInfo);

            // Treatment info
            Map<String, Object> treatmentInfo = new HashMap<>();
            treatmentInfo.put("description", aiResult.getDescription());
            treatmentInfo.put("cause", aiResult.getCause());
            treatmentInfo.put("symptoms", aiResult.getSymptoms());
            treatmentInfo.put("pesticide", aiResult.getPesticide());
            treatmentInfo.put("organic", aiResult.getOrganicTreatment());
            treatmentInfo.put("prevention", aiResult.getPrevention());
            data.put("treatment", treatmentInfo);

            System.out.println("📤 Response data keys: " + data.keySet());

            return new ApiResponse(true, "Disease prediction completed successfully", data);

        } catch (Exception e) {
            System.err.println("❌ Prediction failed: " + e.getMessage());
            e.printStackTrace();
            return new ApiResponse(false, "Prediction failed: " + e.getMessage());
        }

        
    }
    @Override
    public List<PredictionResponse> getPredictionHistory(String email) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        List<Prediction> predictions = predictionRepository
                .findByFarmerIdOrderByPredictionTimeDesc(farmer.getId());

        return predictions.stream()
                .map(pred -> new PredictionResponse(
                        pred.getId(),
                        pred.getImagePath(),
                        pred.getPredictedDisease(),
                        pred.getConfidence(),
                        pred.getSeverity(),
                        pred.getGrowthStage(),
                        pred.getGrowthConfidence(),
                        pred.getDescription(),
                        pred.getCause(),
                        pred.getSymptoms(),
                        pred.getPesticide(),
                        pred.getOrganicTreatment(),
                        pred.getPrevention(),
                        pred.getPredictionTime()
                ))
                .collect(Collectors.toList());
    }
    @Override
    public Page<PredictionResponse> getPredictionHistoryPaginated(String email, Pageable pageable) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        Page<Prediction> predictions = predictionRepository
                .findByFarmerIdOrderByPredictionTimeDesc(farmer.getId(), pageable);

        return predictions.map(pred -> new PredictionResponse(
                pred.getId(),
                pred.getImagePath(),
                pred.getPredictedDisease(),
                pred.getConfidence(),
                pred.getSeverity(),
                pred.getGrowthStage(),
                pred.getGrowthConfidence(),
                pred.getDescription(),
                pred.getCause(),
                pred.getSymptoms(),
                pred.getPesticide(),
                pred.getOrganicTreatment(),
                pred.getPrevention(),
                pred.getPredictionTime()
        ));
    }
}