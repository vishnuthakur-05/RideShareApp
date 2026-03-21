package com.infosys.rideshare.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    private Integer seatsBooked;
    private String status; // Upcoming, Cancelled, Completed
    private Integer rating; // 1-5
    private String review;
    private Double price;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
