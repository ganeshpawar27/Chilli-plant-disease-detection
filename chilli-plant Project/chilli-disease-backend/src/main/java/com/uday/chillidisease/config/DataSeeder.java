package com.uday.chillidisease.config;

import com.uday.chillidisease.entity.Admin;
import com.uday.chillidisease.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!adminRepository.existsByUsername("admin")) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            adminRepository.save(admin);

            System.out.println("=================================");
            System.out.println("Default admin created:");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("=================================");
        }
    }
}