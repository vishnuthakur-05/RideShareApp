package com.infosys.rideshare.controller;

import com.infosys.rideshare.dto.RideDTO;
import com.infosys.rideshare.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RideController {

    private final RideService rideService;

    @PostMapping
    public ResponseEntity<RideDTO> createRide(@RequestBody RideDTO rideDto) {
        return ResponseEntity.ok(rideService.createRide(rideDto));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<RideDTO>> getRidesByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(rideService.getRidesByDriver(driverId));
    }

    @PatchMapping("/{rideId}/status")
    public ResponseEntity<RideDTO> updateRideStatus(@PathVariable Long rideId, @RequestParam String status) {
        return ResponseEntity.ok(rideService.updateRideStatus(rideId, status));
    }

    @PatchMapping("/{rideId}/reschedule")
    public ResponseEntity<RideDTO> rescheduleRide(
            @PathVariable Long rideId,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.TIME) java.time.LocalTime time) {
        return ResponseEntity.ok(rideService.rescheduleRide(rideId, date, time));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RideDTO>> searchRides(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date,
            @RequestParam(required = false) Double sourceLat,
            @RequestParam(required = false) Double sourceLon,
            @RequestParam(required = false) Double destLat,
            @RequestParam(required = false) Double destLon) {
        return ResponseEntity
                .ok(rideService.searchRides(source, destination, date, sourceLat, sourceLon, destLat, destLon));
    }
}
