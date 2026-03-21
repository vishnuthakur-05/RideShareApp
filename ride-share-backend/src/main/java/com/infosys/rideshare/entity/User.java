package com.infosys.rideshare.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password; // BCrypt encoded
    private String firstName;
    private String lastName;
    private String role; // PASSENGER or DRIVER
    private String contactNo;
    private String dob;
    private String gender;

    @Embedded
    private Address address;

    @Embedded
    private Education education;

    @Embedded
    private Document document;
}
