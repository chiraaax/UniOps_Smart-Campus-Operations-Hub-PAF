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
    private final EmailService emailService;
    private final QrCodeService qrCodeService;

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

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Can only approve PENDING bookings");
        }

        booking.setStatus("APPROVED");

        // Generate QR code for approved booking
        try {
            String qrCodeData = qrCodeService.generateQrCode(booking);
            booking.setQrCodeData(qrCodeData);
        } catch (Exception e) {
            System.err.println("Failed to generate QR code: " + e.getMessage());
            // Continue without QR code - booking is still approved
        }

        Booking savedBooking = bookingRepository.save(booking);

        // Send approval email with QR code
        try {
            emailService.sendBookingApprovalEmail(savedBooking);
        } catch (Exception e) {
            // Log error but don't fail the approval
            System.err.println("Failed to send approval email: " + e.getMessage());
        }

        return savedBooking;
    }

    // Reject
    public Booking rejectBooking(String id, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException("Rejection reason cannot be empty");
        }

        Booking booking = bookingRepository.findById(id).orElseThrow();

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Can only reject PENDING bookings");
        }

        booking.setStatus("REJECTED");
        booking.setAdminReason(reason.trim());
        booking.setQrCodeData(null); // Clear QR code for rejected bookings

        Booking savedBooking = bookingRepository.save(booking);

        // Send rejection email
        try {
            emailService.sendBookingRejectionEmail(savedBooking);
        } catch (Exception e) {
            // Log error but don't fail the rejection
            System.err.println("Failed to send rejection email: " + e.getMessage());
        }

        return savedBooking;
    }

    // Cancel
    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus("CANCELLED");
        booking.setQrCodeData(null); // Clear QR code for cancelled bookings
        return bookingRepository.save(booking);
    }
}