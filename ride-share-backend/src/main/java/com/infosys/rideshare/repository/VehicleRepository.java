package com.infosys.rideshare.repository;

import com.infosys.rideshare.entity.Vehicle;
import com.infosys.rideshare.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByDriver(Driver driver);

    List<Vehicle> findByDriverId(Long driverId);
}
