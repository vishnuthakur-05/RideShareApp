package com.infosys.rideshare.controller;

import com.infosys.rideshare.entity.Driver;
import com.infosys.rideshare.entity.Vehicle;
import com.infosys.rideshare.repository.DriverRepository;
import com.infosys.rideshare.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/driver/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    // Helper to get current driver
    private Driver getCurrentDriver() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return driverRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Driver not found"));
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getMyVehicles() {
        try {
            Driver driver = getCurrentDriver();
            return ResponseEntity.ok(vehicleRepository.findByDriver(driver));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicle(@PathVariable Long id) {
        try {
            Driver driver = getCurrentDriver();
            Optional<Vehicle> vehicle = vehicleRepository.findById(id);

            if (vehicle.isPresent()) {
                // Security check: ensure vehicle belongs to driver
                if (!vehicle.get().getDriver().getId().equals(driver.getId())) {
                    return ResponseEntity.status(403).body("Access denied");
                }
                return ResponseEntity.ok(vehicle.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> addVehicle(@RequestBody Vehicle vehicle) {
        try {
            Driver driver = getCurrentDriver();
            vehicle.setDriver(driver);
            vehicle.setStatus("Active"); // Default status

            // Basic validation could go here

            Vehicle savedVehicle = vehicleRepository.save(vehicle);
            return ResponseEntity.ok(savedVehicle);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding vehicle: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        try {
            Driver driver = getCurrentDriver();
            Optional<Vehicle> vehicleOptional = vehicleRepository.findById(id);

            if (vehicleOptional.isPresent()) {
                Vehicle vehicle = vehicleOptional.get();
                // Security check
                if (!vehicle.getDriver().getId().equals(driver.getId())) {
                    return ResponseEntity.status(403).body("Access denied");
                }

                // Update fields
                vehicle.setCompany(vehicleDetails.getCompany());
                vehicle.setModel(vehicleDetails.getModel());
                vehicle.setRcNumber(vehicleDetails.getRcNumber());
                vehicle.setInsuranceNumber(vehicleDetails.getInsuranceNumber());
                vehicle.setYear(vehicleDetails.getYear());
                vehicle.setAc(vehicleDetails.getAc());
                vehicle.setAudio(vehicleDetails.getAudio());
                vehicle.setKms(vehicleDetails.getKms());
                vehicle.setColor(vehicleDetails.getColor());
                vehicle.setImages(vehicleDetails.getImages());

                Vehicle updatedVehicle = vehicleRepository.save(vehicle);
                return ResponseEntity.ok(updatedVehicle);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating vehicle: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        try {
            Driver driver = getCurrentDriver();
            Optional<Vehicle> vehicle = vehicleRepository.findById(id);

            if (vehicle.isPresent()) {
                // Security check
                if (!vehicle.get().getDriver().getId().equals(driver.getId())) {
                    return ResponseEntity.status(403).body("Access denied");
                }
                vehicleRepository.delete(vehicle.get());
                return ResponseEntity.ok("Vehicle deleted successfully");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting vehicle: " + e.getMessage());
        }
    }
}
