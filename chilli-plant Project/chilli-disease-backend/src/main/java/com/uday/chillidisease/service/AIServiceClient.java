package com.uday.chillidisease.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AIServiceClient {

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AIServiceClient() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public PredictionResult predict(MultipartFile file) throws IOException {
        String url = aiServiceUrl + "/predict";

        // Prepare file for upload
        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        // Build multipart request
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parseResponse(response.getBody());
            } else {
                throw new RuntimeException("AI service returned error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to AI service: " + e.getMessage(), e);
        }
    }

    public boolean isHealthy() {
        try {
            String url = aiServiceUrl + "/health";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }

    private PredictionResult parseResponse(String json) throws IOException {
        JsonNode root = objectMapper.readTree(json);

        JsonNode disease = root.get("disease_prediction");
        JsonNode growth = root.get("growth_prediction");
        JsonNode info = disease.get("information");

        PredictionResult result = new PredictionResult();
        result.setDiseaseClass(disease.get("class").asText());
        result.setDiseaseConfidence(disease.get("confidence").asDouble());
        result.setSeverity(disease.get("severity").asText());
        result.setGrowthClass(growth.get("class").asText());
        result.setGrowthConfidence(growth.get("confidence").asDouble());
        result.setDescription(info.get("description").asText());
        result.setCause(info.get("cause").asText());
        result.setSymptoms(info.get("symptoms").asText());
        result.setPesticide(info.get("pesticide").asText());
        result.setOrganicTreatment(info.get("organic_treatment").asText());
        result.setPrevention(info.get("prevention").asText());

        return result;
    }

    // Inner class to hold prediction result
    public static class PredictionResult {
        private String diseaseClass;
        private double diseaseConfidence;
        private String severity;
        private String growthClass;
        private double growthConfidence;
        private String description;
        private String cause;
        private String symptoms;
        private String pesticide;
        private String organicTreatment;
        private String prevention;

        // Getters and Setters
        public String getDiseaseClass() { return diseaseClass; }
        public void setDiseaseClass(String diseaseClass) { this.diseaseClass = diseaseClass; }

        public double getDiseaseConfidence() { return diseaseConfidence; }
        public void setDiseaseConfidence(double diseaseConfidence) { this.diseaseConfidence = diseaseConfidence; }

        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }

        public String getGrowthClass() { return growthClass; }
        public void setGrowthClass(String growthClass) { this.growthClass = growthClass; }

        public double getGrowthConfidence() { return growthConfidence; }
        public void setGrowthConfidence(double growthConfidence) { this.growthConfidence = growthConfidence; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getCause() { return cause; }
        public void setCause(String cause) { this.cause = cause; }

        public String getSymptoms() { return symptoms; }
        public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

        public String getPesticide() { return pesticide; }
        public void setPesticide(String pesticide) { this.pesticide = pesticide; }

        public String getOrganicTreatment() { return organicTreatment; }
        public void setOrganicTreatment(String organicTreatment) { this.organicTreatment = organicTreatment; }

        public String getPrevention() { return prevention; }
        public void setPrevention(String prevention) { this.prevention = prevention; }
    }
}