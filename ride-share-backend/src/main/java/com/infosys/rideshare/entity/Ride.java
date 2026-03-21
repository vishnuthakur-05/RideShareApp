package com.infosys.rideshare.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    private String driverName;

    private String fromLocation;
    private String toLocation;

    @Column(columnDefinition = "TEXT")
    private String routeCoordinates;

    private Double distanceKm;
    private Double basePrice;
    private Double pricePerKm;
    private Double totalPrice;

    private Integer availableSeats;

    private LocalDate date;
    private LocalTime time;

    private String status; // "Upcoming", "Completed", "Cancelled", "Draft"

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
