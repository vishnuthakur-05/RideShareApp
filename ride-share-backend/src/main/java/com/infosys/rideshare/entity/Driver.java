package com.infosys.rideshare.entity;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "driver")
public class Driver extends AbstractUser {

    @Embedded
    private Education education;

    @Embedded
    private Document document;
}
