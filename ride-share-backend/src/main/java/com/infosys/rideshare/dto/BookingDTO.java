package com.infosys.rideshare.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class BookingDTO {
    private Long id;
    private Long rideId;
    private Long passengerId;

    // Extracted ride / passenger info for nice display in frontend
    private String driverName;
    private String carType;
    private String vehicleRegistration;
    private String source;
    private String destination;
    private LocalDate date;
    private String time;

    private Integer seatsBooked;
    private String status;
    private Integer rating;
    private String review;
    private Double price;
    private Double basePrice;
    private Double pricePerKm;
    private Double distanceKm;
}
