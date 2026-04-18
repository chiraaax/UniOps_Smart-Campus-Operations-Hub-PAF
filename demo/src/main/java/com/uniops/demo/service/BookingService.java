package com.uniops.demo.service;

import com.uniops.demo.dto.booking.AvailabilityResponse;
import com.uniops.demo.model.Booking;
import com.uniops.demo.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final QrCodeService qrCodeService;
    private final WaitlistService waitlistService;

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

    public AvailabilityResponse checkAvailability(String resourceName, LocalDateTime startTime, LocalDateTime endTime, String userId) {
        List<Booking> conflicts = bookingRepository.findByResourceNameAndStartTimeLessThanAndEndTimeGreaterThan(
                resourceName, endTime, startTime
        );
        boolean available = conflicts.isEmpty();
        List<String> nextSlots = new ArrayList<>();

        LocalDateTime dayStart = startTime.toLocalDate().atStartOfDay();
        LocalDateTime dayEnd = startTime.toLocalDate().atTime(23, 59, 59);
        List<Booking> dayBookings = bookingRepository.findByResourceNameAndStartTimeBetween(resourceName, dayStart, dayEnd);
        dayBookings.sort(Comparator.comparing(Booking::getStartTime));

        LocalDateTime candidate = startTime;
        for (int i = 0; nextSlots.size() < 3 && !candidate.isAfter(dayEnd); i++) {
            LocalDateTime candidateStart = candidate;
            LocalDateTime candidateEnd = candidateStart.plusMinutes(30);
            boolean overlap = dayBookings.stream().anyMatch(existing ->
                    existing.getStartTime().isBefore(candidateEnd) && existing.getEndTime().isAfter(candidateStart)
            );
            if (!overlap) {
                nextSlots.add(candidateStart.toLocalTime() + " - " + candidateEnd.toLocalTime());
            }
            candidate = candidate.plusMinutes(30);
        }

        int position = 0;
        boolean canJoinWaitlist = !available && userId != null && !userId.isBlank();
        if (canJoinWaitlist) {
            position = waitlistService.getWaitlistPosition(userId, resourceName, startTime, endTime);
        }

        return new AvailabilityResponse(available, nextSlots, canJoinWaitlist, position);
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
        Booking savedBooking = bookingRepository.save(booking);
        try {
            waitlistService.notifyNextWaitlistEntry(booking.getResourceName(), booking.getStartTime(), booking.getEndTime());
        } catch (Exception e) {
            System.err.println("Failed to notify waitlist after cancellation: " + e.getMessage());
        }
        return savedBooking;
    }
}