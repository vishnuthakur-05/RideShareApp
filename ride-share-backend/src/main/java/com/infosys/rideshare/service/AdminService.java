package com.infosys.rideshare.service;

import com.infosys.rideshare.entity.AbstractUser;
import com.infosys.rideshare.entity.Driver;
import com.infosys.rideshare.entity.Passenger;
import com.infosys.rideshare.repository.DriverRepository;
import com.infosys.rideshare.repository.PassengerRepository;
import com.infosys.rideshare.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.infosys.rideshare.util.PasswordGenerator passwordGenerator;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<AbstractUser> getAllUsers() {
        List<AbstractUser> allUsers = new ArrayList<>();
        allUsers.addAll(passengerRepository.findAll());
        allUsers.addAll(driverRepository.findAll());
        return allUsers;
    }

    public List<AbstractUser> getUsersByStatus(String status) {
        List<AbstractUser> filteredUsers = new ArrayList<>();
        filteredUsers.addAll(passengerRepository.findAll().stream()
                .filter(p -> status.equalsIgnoreCase(p.getStatus()))
                .toList());
        filteredUsers.addAll(driverRepository.findAll().stream()
                .filter(d -> status.equalsIgnoreCase(d.getStatus()))
                .toList());
        return filteredUsers;
    }

    public boolean verifyUser(Long id, String status, String role) {
        System.out.println("AdminService: Verifying ID=" + id + ", Status=" + status + ", Role=" + role);
        if (role == null)
            return false;
        String normalizedRole = role.trim();

        if ("APPROVED".equalsIgnoreCase(status)) {
            // Generate temporary password
            String tempPassword = passwordGenerator.generatePassword(8);
            String encodedPassword = passwordEncoder.encode(tempPassword);
            String loginUrl = "http://localhost:3000/login"; // Replace with actual URL

            if ("PASSENGER".equalsIgnoreCase(normalizedRole)) {
                return approvePassenger(id, status, encodedPassword, tempPassword, loginUrl);
            } else if ("DRIVER".equalsIgnoreCase(normalizedRole)) {
                return approveDriver(id, status, encodedPassword, tempPassword, loginUrl);
            }
        } else {
            // Handle Rejection or other status updates
            if ("PASSENGER".equalsIgnoreCase(normalizedRole)) {
                return updatePassengerStatus(id, status);
            } else if ("DRIVER".equalsIgnoreCase(normalizedRole)) {
                return updateDriverStatus(id, status);
            }
        }
        return false;
    }

    private boolean approvePassenger(Long id, String status, String encodedPassword, String tempPassword,
            String loginUrl) {
        Optional<Passenger> passengerOpt = passengerRepository.findById(id);
        if (passengerOpt.isPresent()) {
            Passenger p = passengerOpt.get();
            p.setStatus(status);
            p.setPassword(encodedPassword);
            p.setTempPasswordFlag(true);
            p.setApprovedAt(java.time.LocalDateTime.now());
            passengerRepository.save(p);
            emailService.sendApprovalEmail(p.getEmail(), p.getFirstName(), tempPassword, loginUrl);
            return true;
        }
        return false;
    }

    private boolean approveDriver(Long id, String status, String encodedPassword, String tempPassword,
            String loginUrl) {
        Optional<Driver> driverOpt = driverRepository.findById(id);
        if (driverOpt.isPresent()) {
            Driver d = driverOpt.get();
            d.setStatus(status);
            d.setPassword(encodedPassword);
            d.setTempPasswordFlag(true);
            d.setApprovedAt(java.time.LocalDateTime.now());
            driverRepository.save(d);
            emailService.sendApprovalEmail(d.getEmail(), d.getFirstName(), tempPassword, loginUrl);
            return true;
        }
        return false;
    }

    private boolean updatePassengerStatus(Long id, String status) {
        Optional<Passenger> passenger = passengerRepository.findById(id);
        if (passenger.isPresent()) {
            Passenger p = passenger.get();
            p.setStatus(status);
            passengerRepository.save(p);
            return true;
        }
        return false;
    }

    private boolean updateDriverStatus(Long id, String status) {
        Optional<Driver> driver = driverRepository.findById(id);
        if (driver.isPresent()) {
            Driver d = driver.get();
            d.setStatus(status);
            driverRepository.save(d);
            return true;
        }
        return false;
    }

    @org.springframework.transaction.annotation.Transactional
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalPassengers = passengerRepository.count();
        long totalDrivers = driverRepository.count();
        long activeDrivers = driverRepository.findAll().stream()
                .filter(d -> "APPROVED".equalsIgnoreCase(d.getStatus()))
                .count();
        long pendingVerifications = driverRepository.findAll().stream()
                .filter(d -> "PENDING".equalsIgnoreCase(d.getStatus()))
                .count() +
                passengerRepository.findAll().stream()
                        .filter(p -> "PENDING".equalsIgnoreCase(p.getStatus()))
                        .count();

        stats.put("totalUsers", totalPassengers + totalDrivers);
        stats.put("activeDrivers", activeDrivers);
        
        Double totalRevenue = bookingRepository.calculateTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        
        stats.put("pendingVerifications", pendingVerifications);

        List<com.infosys.rideshare.entity.Booking> allBookings = bookingRepository.findAll();
        Map<String, Double> revenueByDate = new java.util.TreeMap<>();
        Map<String, Integer> ridesByDate = new java.util.TreeMap<>();

        for (com.infosys.rideshare.entity.Booking b : allBookings) {
            String status = b.getStatus();
            if (status != null && (status.equalsIgnoreCase("Completed") || status.equalsIgnoreCase("Paid"))) {
                String date = "";
                if (b.getRide() != null && b.getRide().getDate() != null) {
                    date = b.getRide().getDate().toString();
                } else if (b.getCreatedAt() != null) {
                    date = b.getCreatedAt().toLocalDate().toString();
                } else {
                    date = java.time.LocalDate.now().toString();
                }
                
                double price = b.getPrice() != null ? b.getPrice() : 0.0;
                revenueByDate.put(date, revenueByDate.getOrDefault(date, 0.0) + price);
                ridesByDate.put(date, ridesByDate.getOrDefault(date, 0) + 1);
            }
        }
        
        List<Map<String, Object>> chartDataList = new ArrayList<>();
        for (String date : revenueByDate.keySet()) {
            Map<String, Object> dataPoint = new HashMap<>();
            String name = date.length() >= 5 ? date.substring(5) : date; // Extract MM-DD
            dataPoint.put("name", name);
            dataPoint.put("fullDate", date);
            dataPoint.put("revenue", revenueByDate.get(date));
            dataPoint.put("rides", ridesByDate.get(date));
            chartDataList.add(dataPoint);
        }
        
        // Take the last 10 days
        if (chartDataList.size() > 10) {
            chartDataList = chartDataList.subList(chartDataList.size() - 10, chartDataList.size());
        }
        stats.put("chartData", chartDataList);

        return stats;
    }
}
