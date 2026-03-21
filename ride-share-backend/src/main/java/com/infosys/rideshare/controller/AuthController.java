package com.infosys.rideshare.controller;

import com.infosys.rideshare.dto.AuthResponse;
import com.infosys.rideshare.dto.LoginRequest;
import com.infosys.rideshare.dto.RegisterRequest;
import com.infosys.rideshare.dto.ChangePasswordRequest;
import com.infosys.rideshare.dto.UpdateProfileRequest;
import com.infosys.rideshare.entity.AbstractUser;
import com.infosys.rideshare.entity.Admin;
import com.infosys.rideshare.entity.Document;
import com.infosys.rideshare.entity.Driver;
import com.infosys.rideshare.entity.Passenger;
import com.infosys.rideshare.repository.AdminRepository;
import com.infosys.rideshare.repository.DriverRepository;
import com.infosys.rideshare.repository.PassengerRepository;
import com.infosys.rideshare.service.MyUserDetailsService;
import com.infosys.rideshare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/register", consumes = { "multipart/form-data" })
    public ResponseEntity<?> registerUser(@RequestPart("user") RegisterRequest registerRequest,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        System.out.println(
                "Processing registration for: " + registerRequest.getEmail() + " as " + registerRequest.getRole());

        if (adminRepository.existsByEmail(registerRequest.getEmail()) ||
                passengerRepository.existsByEmail(registerRequest.getEmail()) ||
                driverRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        AbstractUser user;

        switch (registerRequest.getRole().toUpperCase()) {
            case "ADMIN":
                user = new Admin();
                break;
            case "DRIVER":
                user = new Driver();
                break;
            case "PASSENGER":
            default:
                user = new Passenger();
                break;
        }

        // Map DTO to Entity
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setContactNo(registerRequest.getContactNo());
        if (registerRequest.getDob() != null) {
            user.setDob(registerRequest.getDob().toString());
        }
        user.setGender(registerRequest.getGender());
        user.setRole(registerRequest.getRole().toUpperCase());
        user.setAddress(registerRequest.getAddress());
        user.setStatus("PENDING"); // Default status

        try {
            // Handle Role Specifics
            if (user instanceof Driver) {
                Driver driver = (Driver) user;
                driver.setEducation(registerRequest.getEducation());

                // Handle Document
                Document doc = new Document();
                doc.setType(registerRequest.getDocType());
                doc.setNumber(registerRequest.getDocNumber());
                if (file != null && !file.isEmpty()) {
                    doc.setFileName(file.getOriginalFilename());
                }
                driver.setDocument(doc);

                driverRepository.save(driver);
            } else if (user instanceof Admin) {
                user.setStatus("APPROVED"); // Auto-approve admin registration via API
                adminRepository.save((Admin) user);
            } else {
                passengerRepository.save((Passenger) user);
            }

            return ResponseEntity.ok("User registered successfully! Please wait for admin approval.");
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Registration failed: Email already exists.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }

        // Find user to get role and status
        AbstractUser user = null;
        if (adminRepository.existsByEmail(loginRequest.getEmail())) {
            user = adminRepository.findByEmail(loginRequest.getEmail()).get();
        } else if (driverRepository.existsByEmail(loginRequest.getEmail())) {
            user = driverRepository.findByEmail(loginRequest.getEmail()).get();
        } else if (passengerRepository.existsByEmail(loginRequest.getEmail())) {
            user = passengerRepository.findByEmail(loginRequest.getEmail()).get();
        }

        if (user == null) {
            throw new Exception("User not found");
        }

        // Check Status
        if (!"APPROVED".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(403)
                    .body("Your account is " + user.getStatus() + ". Please wait for admin approval.");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        boolean isFirstLogin = user.getTempPasswordFlag() != null && user.getTempPasswordFlag();
        return ResponseEntity.ok(new AuthResponse(jwt, "Login Successful", user.getRole(), isFirstLogin));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        System.out.println("Change Password Request for: " + request.getEmail());
        try {
            AbstractUser user = null;
            if (adminRepository.existsByEmail(request.getEmail())) {
                user = adminRepository.findByEmail(request.getEmail()).get();
            } else if (driverRepository.existsByEmail(request.getEmail())) {
                user = driverRepository.findByEmail(request.getEmail()).get();
            } else if (passengerRepository.existsByEmail(request.getEmail())) {
                user = passengerRepository.findByEmail(request.getEmail()).get();
            }

            if (user == null) {
                System.out.println("User not found for email: " + request.getEmail());
                return ResponseEntity.badRequest().body("User not found");
            }

            System.out.println("User found: " + user.getId() + " Role: " + user.getRole());

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setTempPasswordFlag(false);

            System.out.println("Saving user with new password and tempFlag=false");

            if (user instanceof Admin) {
                adminRepository.save((Admin) user);
            } else if (user instanceof Driver) {
                driverRepository.save((Driver) user);
            } else {
                passengerRepository.save((Passenger) user);
            }

            System.out.println("User saved successfully.");
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error changing password: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(java.security.Principal principal) {
        try {
            String email = principal.getName();
            AbstractUser user = null;

            if (adminRepository.existsByEmail(email)) {
                user = adminRepository.findByEmail(email).get();
            } else if (driverRepository.existsByEmail(email)) {
                user = driverRepository.findByEmail(email).get();
            } else if (passengerRepository.existsByEmail(email)) {
                user = passengerRepository.findByEmail(email).get();
            }

            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            boolean isFirstLogin = user.getTempPasswordFlag() != null && user.getTempPasswordFlag();

            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("contactNo", user.getContactNo());
            response.put("address", user.getAddress());
            response.put("gender", user.getGender());
            response.put("role", user.getRole());
            response.put("isFirstLogin", isFirstLogin);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        try {
            AbstractUser user = null;
            if (adminRepository.existsByEmail(request.getEmail())) {
                user = adminRepository.findByEmail(request.getEmail()).get();
            } else if (driverRepository.existsByEmail(request.getEmail())) {
                user = driverRepository.findByEmail(request.getEmail()).get();
            } else if (passengerRepository.existsByEmail(request.getEmail())) {
                user = passengerRepository.findByEmail(request.getEmail()).get();
            }

            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Update allowed fields
            if (request.getFirstName() != null)
                user.setFirstName(request.getFirstName());
            if (request.getLastName() != null)
                user.setLastName(request.getLastName());
            if (request.getContactNo() != null)
                user.setContactNo(request.getContactNo());
            if (request.getAddress() != null)
                user.setAddress(request.getAddress());
            if (request.getGender() != null)
                user.setGender(request.getGender());

            if (user instanceof Admin) {
                adminRepository.save((Admin) user);
            } else if (user instanceof Driver) {
                driverRepository.save((Driver) user);
            } else {
                passengerRepository.save((Passenger) user);
            }

            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }
}
