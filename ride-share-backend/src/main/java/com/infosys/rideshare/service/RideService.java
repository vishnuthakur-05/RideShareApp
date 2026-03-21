package com.infosys.rideshare.service;

import com.infosys.rideshare.dto.RideDTO;
import com.infosys.rideshare.entity.Driver;
import com.infosys.rideshare.entity.Ride;
import com.infosys.rideshare.entity.Vehicle;
import com.infosys.rideshare.repository.DriverRepository;
import com.infosys.rideshare.repository.RideRepository;
import com.infosys.rideshare.repository.VehicleRepository;
import com.infosys.rideshare.repository.BookingRepository;
import com.infosys.rideshare.entity.Booking;
import com.infosys.rideshare.entity.Passenger;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final JavaMailSender mailSender;

    public RideDTO createRide(RideDTO rideDto) {
        Driver driver = driverRepository.findById(rideDto.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        Vehicle vehicle = vehicleRepository.findById(rideDto.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (rideDto.getAvailableSeats() == null
                || (vehicle.getSeatCapacity() != null && rideDto.getAvailableSeats() > vehicle.getSeatCapacity())) {
            throw new RuntimeException("Available seats cannot exceed vehicle capacity");
        }

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setVehicle(vehicle);
        ride.setDriverName(
                rideDto.getDriverName() != null && !rideDto.getDriverName().isEmpty() ? rideDto.getDriverName()
                        : driver.getFirstName() + " " + driver.getLastName());
        ride.setFromLocation(rideDto.getFromLocation());
        ride.setToLocation(rideDto.getToLocation());
        ride.setRouteCoordinates(rideDto.getRouteCoordinates());
        ride.setDistanceKm(rideDto.getDistanceKm());
        ride.setBasePrice(rideDto.getBasePrice());
        ride.setPricePerKm(rideDto.getPricePerKm());
        ride.setTotalPrice(rideDto.getTotalPrice());
        ride.setAvailableSeats(rideDto.getAvailableSeats());
        ride.setDate(rideDto.getDate());
        ride.setTime(rideDto.getTime());
        ride.setStatus(rideDto.getStatus() != null ? rideDto.getStatus() : "Upcoming");

        Ride savedRide = rideRepository.save(ride);
        return mapToDTO(savedRide);
    }

    public List<RideDTO> getRidesByDriver(Long driverId) {
        return rideRepository.findByDriverId(driverId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public RideDTO updateRideStatus(Long rideId, String status) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        ride.setStatus(status);
        Ride savedRide = rideRepository.save(ride);

        // Cascade to bookings
        List<Booking> bookings = bookingRepository.findByRideId(rideId);
        for (Booking booking : bookings) {
            if (!"Cancelled".equals(booking.getStatus())) {
                booking.setStatus(status);
                bookingRepository.save(booking);

                // Notify passenger
                try {
                    Passenger passenger = booking.getPassenger();
                    if (passenger != null && passenger.getEmail() != null) {
                        SimpleMailMessage message = new SimpleMailMessage();
                        message.setTo(passenger.getEmail());
                        message.setSubject("Ride Status Updated: " + status);
                        message.setText("Hello " + passenger.getFirstName() + ",\n\n" +
                                "The status of your ride from " + ride.getFromLocation() + " to "
                                + ride.getToLocation() + " has been updated to: " + status + ".\n\n" +
                                "Thank you for using RideShare!");
                        mailSender.send(message);
                    }
                } catch (Exception e) {
                    System.err.println("Failed to send status update email: " + e.getMessage());
                }
            }
        }

        return mapToDTO(savedRide);
    }

    public RideDTO rescheduleRide(Long rideId, java.time.LocalDate date, java.time.LocalTime time) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        ride.setDate(date);
        ride.setTime(time);

        // Also tag ride or bookings as "Rescheduled" if needed, but for now just update
        // date/time
        Ride savedRide = rideRepository.save(ride);

        // Notify passengers about rescheduling
        List<Booking> bookings = bookingRepository.findByRideId(rideId);
        for (Booking booking : bookings) {
            try {
                Passenger passenger = booking.getPassenger();
                if (passenger != null && passenger.getEmail() != null) {
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(passenger.getEmail());
                    message.setSubject("Important: Your Ride has been Rescheduled");
                    message.setText("Hello " + passenger.getFirstName() + ",\n\n" +
                            "Your ride from " + ride.getFromLocation() + " to " + ride.getToLocation() +
                            " has been rescheduled by the driver.\n\n" +
                            "New Date: " + date + "\n" +
                            "New Time: " + time + "\n\n" +
                            "Please check your dashboard for details.");
                    mailSender.send(message);
                }
            } catch (Exception e) {
                System.err.println("Failed to send reschedule email: " + e.getMessage());
            }
        }

        return mapToDTO(savedRide);
    }

    public List<RideDTO> searchRides(String source, String destination, java.time.LocalDate date,
            Double sourceLat, Double sourceLon, Double destLat, Double destLon) {
        List<Ride> upcomingRides = rideRepository.findUpcomingRides(date);

        return upcomingRides.stream()
                .filter(ride -> isMatch(ride, source, destination, sourceLat, sourceLon, destLat, destLon))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private boolean isMatch(Ride ride, String source, String destination, Double sLat, Double sLon, Double dLat,
            Double dLon) {
        boolean match = true;
        double radiusKm = 10.0; // 10 km radius for matching

        // If coordinate-based search
        if (sLat != null && sLon != null && dLat != null && dLon != null) {
            String coordsStr = ride.getRouteCoordinates();
            if (coordsStr != null && !coordsStr.trim().isEmpty() && !coordsStr.equals("null")) {
                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    double[][] routeCoords = mapper.readValue(coordsStr, double[][].class);

                    boolean sourceFound = false;
                    boolean destFound = false;

                    for (double[] point : routeCoords) {
                        double lat = point[0]; // PostRide.js maps it to [lat, lon]
                        double lon = point[1];

                        if (!sourceFound) {
                            if (calculateDistance(sLat, sLon, lat, lon) <= radiusKm) {
                                sourceFound = true;
                            }
                        } else if (!destFound) {
                            if (calculateDistance(dLat, dLon, lat, lon) <= radiusKm) {
                                destFound = true;
                                break;
                            }
                        }
                    }
                    if (sourceFound && destFound) {
                        return true;
                    }
                    // If coordinates were searched but route didn't match, string fallback is
                    // sketchy but necessary per user request
                    return false;
                } catch (Exception e) {
                    System.err.println("Failed to parse route coords for ride " + ride.getId());
                }
            }
        }

        // Text-based fallback (Case-insensitive matching)
        if (source != null && !source.trim().isEmpty()) {
            if (ride.getFromLocation() == null
                    || !ride.getFromLocation().toLowerCase().contains(source.toLowerCase())) {
                match = false;
            }
        }
        if (destination != null && !destination.trim().isEmpty()) {
            if (ride.getToLocation() == null
                    || !ride.getToLocation().toLowerCase().contains(destination.toLowerCase())) {
                match = false;
            }
        }
        return match;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private RideDTO mapToDTO(Ride ride) {
        RideDTO dto = new RideDTO();
        dto.setId(ride.getId());
        dto.setDriverId(ride.getDriver().getId());
        dto.setVehicleId(ride.getVehicle().getId());
        dto.setDriverName(ride.getDriverName() != null && !ride.getDriverName().isEmpty() ? ride.getDriverName()
                : ride.getDriver().getFirstName() + " " + ride.getDriver().getLastName());
        dto.setVehicleModel(ride.getVehicle().getCompany() + " " + ride.getVehicle().getModel());
        dto.setVehicleRegistration(ride.getVehicle().getRcNumber());
        dto.setFromLocation(ride.getFromLocation());
        dto.setToLocation(ride.getToLocation());
        dto.setRouteCoordinates(ride.getRouteCoordinates());
        dto.setDistanceKm(ride.getDistanceKm());
        dto.setBasePrice(ride.getBasePrice());
        dto.setPricePerKm(ride.getPricePerKm());
        dto.setTotalPrice(ride.getTotalPrice());
        dto.setAvailableSeats(ride.getAvailableSeats());
        dto.setDate(ride.getDate());
        dto.setTime(ride.getTime());
        dto.setStatus(ride.getStatus());

        List<Booking> bookings = bookingRepository.findByRideId(ride.getId());
        List<Booking> ratedBookings = bookings.stream()
                .filter(b -> b.getRating() != null && b.getRating() > 0)
                .collect(Collectors.toList());

        if (!ratedBookings.isEmpty()) {
            double avg = ratedBookings.stream().mapToInt(Booking::getRating).average().orElse(0.0);
            dto.setAverageRating(Math.round(avg * 10.0) / 10.0);

            List<String> reviews = ratedBookings.stream()
                    .filter(b -> b.getReview() != null && !b.getReview().isEmpty())
                    .map(b -> b.getReview())
                    .collect(Collectors.toList());
            dto.setReviews(reviews);
        }
        dto.setRatingCount(ratedBookings.size());

        Double driverRating = bookingRepository.getAverageRatingForDriver(ride.getDriver().getId());
        if (driverRating != null) {
            dto.setDriverRating(Math.round(driverRating * 10.0) / 10.0);
        }

        dto.setTotalRatingCount(bookingRepository.countRatingsByDriverId(ride.getDriver().getId()));

        return dto;
    }
}
