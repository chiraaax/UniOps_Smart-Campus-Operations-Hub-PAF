package com.uniops.demo.service;

import com.uniops.demo.model.Booking;
import com.uniops.demo.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    // Create booking
    public Booking createBooking(Booking booking) {

        // Check conflicts
        List<Booking> conflicts = bookingRepository
                .findByResourceNameAndStartTimeLessThanAndEndTimeGreaterThan(
                        booking.getResourceName(),
                        booking.getEndTime(),
                        booking.getStartTime()
                );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Time slot already booked!");
        }

        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    // Get user bookings
    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Get all bookings (Admin)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Approve
    public Booking approveBooking(String id) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus("APPROVED");
        return bookingRepository.save(booking);
    }

    // Reject
    public Booking rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus("REJECTED");
        booking.setAdminReason(reason);
        return bookingRepository.save(booking);
    }

    // Cancel
    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }
}