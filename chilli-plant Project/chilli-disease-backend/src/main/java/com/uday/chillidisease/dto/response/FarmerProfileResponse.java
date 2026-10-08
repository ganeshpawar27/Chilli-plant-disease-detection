package com.uday.chillidisease.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FarmerProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String village;
    private LocalDateTime createdAt;
    private long totalPredictions;
}