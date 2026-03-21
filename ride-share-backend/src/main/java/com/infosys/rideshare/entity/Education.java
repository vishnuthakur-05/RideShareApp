package com.infosys.rideshare.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@jakarta.persistence.Embeddable
public class Education {
    private String tenthSchool;
    private String tenthYear;
    private String tenthPercentage;
    private String twelfthSchool;
    private String twelfthYear;
    private String twelfthPercentage;
    private String graduationCollege;
    private String graduationYear;
    private String graduationPercentage;
}
