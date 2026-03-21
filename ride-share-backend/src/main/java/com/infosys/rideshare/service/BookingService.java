package com.infosys.rideshare.service;

import com.infosys.rideshare.dto.BookingDTO;
import com.infosys.rideshare.entity.Booking;
import com.infosys.rideshare.entity.Ride;
import com.infosys.rideshare.entity.Passenger;
import com.infosys.rideshare.repository.BookingRepository;
import com.infosys.rideshare.repository.RideRepository;
import com.infosys.rideshare.repository.PassengerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final PassengerRepository passengerRepository;
    private final JavaMailSender mailSender;

    public BookingDTO createBooking(BookingDTO bookingDto) {
        Ride ride = rideRepository.findById(bookingDto.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        Passenger passenger = passengerRepository.findById(bookingDto.getPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        if (ride.getAvailableSeats() < bookingDto.getSeatsBooked()) {
            throw new RuntimeException("Not enough seats available");
        }

        // Deduct seats
        ride.setAvailableSeats(ride.getAvailableSeats() - bookingDto.getSeatsBooked());
        rideRepository.save(ride);

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setPassenger(passenger);
        booking.setSeatsBooked(bookingDto.getSeatsBooked());
        booking.setStatus("Pending");
        booking.setRating(0);

        double perSeatPrice = (ride.getTotalPrice() != null && ride.getTotalPrice() > 0) ? ride.getTotalPrice()
                : (ride.getBasePrice() != null ? ride.getBasePrice() : 0) +
                        ((ride.getPricePerKm() != null ? ride.getPricePerKm() : 0)
                                * (ride.getDistanceKm() != null ? ride.getDistanceKm() : 0));

        double totalPrice = perSeatPrice * bookingDto.getSeatsBooked();
        // Round to 2 decimal places
        totalPrice = Math.round(totalPrice * 100.0) / 100.0;

        booking.setPrice(totalPrice);

        Booking savedBooking = bookingRepository.save(booking);

        // Send email to driver
        try {
            if (ride.getDriver() != null && ride.getDriver().getEmail() != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(ride.getDriver().getEmail());
                message.setSubject("New Ride Booking Request");
                message.setText("Hello " + ride.getDriver().getFirstName() + ",\n\n" +
                        "You have a new booking request from " + passenger.getFirstName() + " "
                        + passenger.getLastName() + ".\n" +
                        "Route: " + ride.getFromLocation() + " to " + ride.getToLocation() + ".\n" +
                        "Seats Requested: " + bookingDto.getSeatsBooked() + ".\n\n" +
                        "Please check your notifications to accept or reject this request.\n");
                mailSender.send(message);
            }
        } catch (Exception e) {
            // Log error but don't fail booking natively
            System.err.println("Failed to send email to driver: " + e.getMessage());
        }

        return mapToDTO(savedBooking);
    }

    public List<BookingDTO> getPassengerBookings(Long passengerId) {
        return bookingRepository.findByPassengerIdOrderByCreatedAtDesc(passengerId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getDriverBookings(Long driverId) {
        return bookingRepository.findByRideDriverIdOrderByCreatedAtDesc(driverId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO updateBookingStatus(Long id, String status, String transactionId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        boolean isStatusChanged = !status.equals(booking.getStatus());

        // If cancelled, return seats
        if ("Cancelled".equals(status) && !"Cancelled".equals(booking.getStatus())) {
            Ride ride = booking.getRide();
            ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());
            rideRepository.save(ride);
        }

        booking.setStatus(status);
        Booking savedBooking = bookingRepository.save(booking);

        if (isStatusChanged
                && ("Upcoming".equals(status) || "Cancelled".equals(status) || "Completed".equals(status) || "Paid".equals(status))) {
            try {
                Passenger passenger = booking.getPassenger();
                Ride ride = booking.getRide();
                if (passenger != null && passenger.getEmail() != null) {
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(passenger.getEmail());

                    if ("Upcoming".equals(status)) {
                        message.setSubject("Ride Request Accepted");
                        message.setText("Great news " + passenger.getFirstName() + "!\n\n" +
                                "Your booking request for the ride from " + ride.getFromLocation() + " to "
                                + ride.getToLocation() + " has been ACCEPTED by the driver.\n\n" +
                                "Please log in to your dashboard to complete the payment for this ride.\n");
                    } else if ("Cancelled".equals(status)) {
                        message.setSubject("Ride Request Rejected/Cancelled");
                        message.setText("Hello " + passenger.getFirstName() + ",\n\n" +
                                "Unfortunately, your booking request for the ride from " + ride.getFromLocation()
                                + " to " + ride.getToLocation() + " has been rejected or cancelled.\n\n" +
                                "Please try booking another ride from your dashboard.\n");
                    } else if ("Completed".equals(status)) {
                        message.setSubject("Ride Completed");
                        message.setText("Hello " + passenger.getFirstName() + ",\n\n" +
                                "Your ride from " + ride.getFromLocation() + " to " + ride.getToLocation()
                                + " has been marked as Completed.\n\n" +
                                "Thank you for using RideShare!\n");
                    } else if ("Paid".equals(status)) {
                        message.setSubject("Payment Receipt - RideShare");
                        
                        double basePrice = ride.getBasePrice() != null ? ride.getBasePrice() : 0.0;
                        double distanceCharge = booking.getPrice() - basePrice;
                        
                        String receipt = "Hello " + passenger.getFirstName() + ",\n\n" +
                                "Your payment for the ride from " + ride.getFromLocation() + " to "
                                + ride.getToLocation() + " was successful.\n\n" +
                                "--- Payment Receipt ---\n" +
                                "Transaction ID: " + (transactionId != null && !transactionId.isEmpty() ? transactionId : "N/A") + "\n" +
                                "Base Fare: ₹" + String.format("%.2f", basePrice) + "\n" +
                                "Distance Charge: ₹" + String.format("%.2f", distanceCharge) + "\n" +
                                "Total Amount Paid: ₹" + String.format("%.2f", booking.getPrice()) + "\n" +
                                "Seats Booked: " + booking.getSeatsBooked() + "\n" +
                                "-----------------------\n\n" +
                                "Thank you for using RideShare!\n";
                        message.setText(receipt);
                    }
                    mailSender.send(message);
                }
            } catch (Exception e) {
                System.err.println("Failed to send status update email to passenger: " + e.getMessage());
            }
        }

        return mapToDTO(savedBooking);
    }

    public BookingDTO rateBooking(Long id, Integer rating, String review) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setRating(rating);
        booking.setReview(review);
        return mapToDTO(bookingRepository.save(booking));
    }

    private BookingDTO mapToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setRideId(booking.getRide().getId());
        dto.setPassengerId(booking.getPassenger().getId());
        dto.setSeatsBooked(booking.getSeatsBooked());
        dto.setStatus(booking.getStatus());
        dto.setRating(booking.getRating());
        dto.setReview(booking.getReview());
        dto.setPrice(booking.getPrice());

        if (booking.getRide() != null) {
            Ride r = booking.getRide();
            if (r.getDriverName() != null && !r.getDriverName().isEmpty()) {
                dto.setDriverName(r.getDriverName());
            } else if (r.getDriver() != null) {
                dto.setDriverName(r.getDriver().getFirstName() + " " + r.getDriver().getLastName());
            }
            if (r.getVehicle() != null) {
                dto.setCarType(r.getVehicle().getCompany() + " " + r.getVehicle().getModel());
                dto.setVehicleRegistration(r.getVehicle().getRcNumber());
            }
            dto.setSource(r.getFromLocation());
            dto.setDestination(r.getToLocation());
            dto.setDate(r.getDate());
            if (r.getTime() != null) {
                dto.setTime(r.getTime().toString());
            }
            dto.setBasePrice(r.getBasePrice());
            dto.setPricePerKm(r.getPricePerKm());
            dto.setDistanceKm(r.getDistanceKm());
        }
        return dto;
    }
}
