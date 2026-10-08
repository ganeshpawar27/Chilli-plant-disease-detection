package com.uday.chillidisease.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileStorageUtil {

    private final Path uploadDir;

    public FileStorageUtil() {
        // Use absolute path to avoid issues
        this.uploadDir = Paths.get(System.getProperty("user.dir"), "uploads");

        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
                System.out.println("Upload directory created at: " + uploadDir.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("ERROR: Could not create upload directory: " + e.getMessage());
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String saveFile(MultipartFile file) {
        try {
            // Validate file
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("File is empty or null");
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = ".jpg"; // Default extension

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = UUID.randomUUID().toString() + extension;

            // Save file
            Path targetPath = uploadDir.resolve(newFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("File saved successfully: " + targetPath.toAbsolutePath());

            return newFilename;

        } catch (IOException e) {
            System.err.println("ERROR saving file: " + e.getMessage());
            throw new RuntimeException("Failed to save file: " + e.getMessage(), e);
        }
    }

    public Path getFilePath(String filename) {
        return uploadDir.resolve(filename);
    }

    public void deleteFile(String filename) {
        try {
            Path filePath = uploadDir.resolve(filename);
            Files.deleteIfExists(filePath);
            System.out.println("File deleted: " + filename);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage(), e);
        }
    }
}