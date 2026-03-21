package com.infosys.rideshare.repository;

import com.infosys.rideshare.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPassengerIdOrderByCreatedAtDesc(Long passengerId);

    List<Booking> findByPassengerIdAndStatusOrderByCreatedAtDesc(Long passengerId, String status);

    List<Booking> findByRideId(Long rideId);

    List<Booking> findByRideDriverIdOrderByCreatedAtDesc(Long driverId);

    @org.springframework.data.jpa.repository.Query("SELECT AVG(b.rating) FROM Booking b WHERE b.ride.driver.id = :driverId AND b.rating > 0")
    Double getAverageRatingForDriver(@org.springframework.data.repository.query.Param("driverId") Long driverId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(b) FROM Booking b WHERE b.ride.driver.id = :driverId AND b.rating > 0")
    Long countRatingsByDriverId(@org.springframework.data.repository.query.Param("driverId") Long driverId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(b.price) FROM Booking b WHERE UPPER(b.status) IN ('COMPLETED', 'PAID')")
    Double calculateTotalRevenue();
}
