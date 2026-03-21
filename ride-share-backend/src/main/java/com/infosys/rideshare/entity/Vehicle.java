package com.infosys.rideshare.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String model;
    private String rcNumber;
    private String insuranceNumber;
    private String year;
    private String ac; // "AC" or "Non-AC"
    private String audio; // "Yes" or "No"
    private String kms;
    private String color;
    private String status; // "Active", "In Maintenance"
    private Integer seatCapacity;

    // Only storing filenames/URLs for now as per requirement
    @ElementCollection
    @Column(length = 1000000)
    private java.util.List<String> images;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;
}
