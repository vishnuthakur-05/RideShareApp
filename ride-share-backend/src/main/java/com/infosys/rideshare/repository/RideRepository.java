package com.infosys.rideshare.repository;

import com.infosys.rideshare.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriverId(Long driverId);

    List<Ride> findByDriverIdAndStatus(Long driverId, String status);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Ride r WHERE r.status = 'Upcoming' AND (:date IS NULL OR r.date = :date)")
    List<Ride> findUpcomingRides(@org.springframework.data.repository.query.Param("date") java.time.LocalDate date);
}
