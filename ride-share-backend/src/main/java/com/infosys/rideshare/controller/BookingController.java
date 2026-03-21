package com.infosys.rideshare.controller;

import com.infosys.rideshare.dto.BookingDTO;
import com.infosys.rideshare.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDto) {
        return ResponseEntity.ok(bookingService.createBooking(bookingDto));
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<List<BookingDTO>> getPassengerBookings(@PathVariable Long passengerId) {
        return ResponseEntity.ok(bookingService.getPassengerBookings(passengerId));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<BookingDTO>> getDriverBookings(@PathVariable Long driverId) {
        return ResponseEntity.ok(bookingService.getDriverBookings(driverId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String transactionId) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, transactionId));
    }

    @PatchMapping("/{id}/rate")
    public ResponseEntity<BookingDTO> rateBooking(
            @PathVariable Long id,
            @RequestParam Integer rating,
            @RequestParam(required = false) String review) {
        return ResponseEntity.ok(bookingService.rateBooking(id, rating, review));
    }
}
