package com.uday.chillidisease.exception;

import com.uday.chillidisease.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity
                .badRequest()
                .body(new ApiResponse(false, "Validation failed", errors));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        return ResponseEntity
                .badRequest()
                .body(new ApiResponse(false, "File size exceeds maximum limit (10MB)"));
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ApiResponse> handleMultipartException(MultipartException ex) {
        return ResponseEntity
                .badRequest()
                .body(new ApiResponse(false, "Error processing file upload"));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException ex) {
        // Log the full error for debugging
        System.err.println("Runtime Exception: " + ex.getMessage());
        ex.printStackTrace();

        return ResponseEntity
                .badRequest()
                .body(new ApiResponse(false, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGenericException(Exception ex) {
        // Log the full error for debugging
        System.err.println("Unexpected Error: " + ex.getMessage());
        ex.printStackTrace();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Internal server error: " + ex.getMessage()));
    }
}