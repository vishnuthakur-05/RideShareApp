package com.infosys.rideshare.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@jakarta.persistence.Embeddable
public class Document {
    private String type; // AADHAR / PAN
    private String number;
    private String fileName;
    // In real app, store Download URL here after uploading to Firebase Storage
}
