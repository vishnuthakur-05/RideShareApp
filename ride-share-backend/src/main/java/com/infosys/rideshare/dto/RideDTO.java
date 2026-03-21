package com.infosys.rideshare.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class RideDTO {
    private Long id;
    private Long driverId;
    private Long vehicleId;

    // Additional fields for response to not send entire structure back (optional,
    // but good practice)
    private String driverName;
    private String vehicleModel;
    private String vehicleRegistration;

    private String fromLocation;
    private String toLocation;
    private String routeCoordinates;

    private Double distanceKm;
    private Double basePrice;
    private Double pricePerKm;
    private Double totalPrice;

    private Integer availableSeats;

    private LocalDate date;
    private LocalTime time;

    private String status;
    private Double averageRating;
    private Double driverRating;
    private java.util.List<String> reviews;
    private Integer ratingCount;
    private Long totalRatingCount;
}
