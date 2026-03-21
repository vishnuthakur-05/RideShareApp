package com.infosys.rideshare.dto;

import com.infosys.rideshare.entity.Address;
import com.infosys.rideshare.entity.Education;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String contactNo;
    private LocalDate dob;
    private String gender;
    private String role;

    private Address address;
    private Education education;

    // Document details (file upload handled separately or via base64 for now)
    private String docType;
    private String docNumber;
}
