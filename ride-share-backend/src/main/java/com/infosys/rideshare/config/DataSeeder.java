package com.infosys.rideshare.config;

import com.infosys.rideshare.entity.Admin;
import com.infosys.rideshare.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin with email 'admin@gmail.com' exists
        if (!adminRepository.existsByEmail("admin@gmail.com")) {
            Admin admin = new Admin();
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole("ADMIN");
            admin.setContactNo("0000000000"); // Dummy contact
            admin.setStatus("APPROVED"); // Admins are auto-approved

            adminRepository.save(admin);
            System.out.println("Admin user created successfully: username 'admin@gmail.com', password 'admin123'");
        } else {
            System.out.println("Admin user already exists.");
        }
    }
}
