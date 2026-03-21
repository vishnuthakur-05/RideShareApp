package com.infosys.rideshare.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@jakarta.persistence.Embeddable
public class Address {
    private String plotNo;
    private String areaStreet;
    private String landmark;
    private String pincode;
    private String city;
    private String state;
    private String country;
}
