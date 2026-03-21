package com.infosys.rideshare.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@MappedSuperclass
public abstract class AbstractUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password; // BCrypt encoded
    private String firstName;
    private String lastName;
    private String role; // ADMIN, PASSENGER, DRIVER
    private String contactNo;
    private String dob;
    private String gender;

    private String status; // PENDING, APPROVED, REJECTED

    @Embedded
    private Address address;

    private Boolean tempPasswordFlag;
    private java.time.LocalDateTime approvedAt;
}
