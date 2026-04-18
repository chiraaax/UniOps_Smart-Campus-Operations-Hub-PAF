package com.uniops.demo.controller;

import com.uniops.demo.dto.booking.AvailabilityResponse;
import com.uniops.demo.dto.waitlist.WaitlistRequest;
import com.uniops.demo.model.Booking;
import com.uniops.demo.model.WaitlistEntry;
import com.uniops.demo.service.BookingService;
import com.uniops.demo.service.QrCodeService;
import com.uniops.demo.service.WaitlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin
public class BookingController {

    private final BookingService bookingService;
    private final QrCodeService qrCodeService;
    private final WaitlistService waitlistService;

    // Create booking
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // User bookings
    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable String userId) {
        return bookingService.getUserBookings(userId);
    }

    @GetMapping("/availability")
    public AvailabilityResponse getAvailability(
            @RequestParam String resourceName,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam(required = false) String userId
    ) {
        LocalDateTime start = LocalDateTime.parse(startTime);
        LocalDateTime end = LocalDateTime.parse(endTime);
        return bookingService.checkAvailability(resourceName, start, end, userId);
    }

    @PostMapping("/waitlist")
    public WaitlistEntry joinWaitlist(@RequestBody WaitlistRequest request) {
        return waitlistService.joinWaitlist(request.getUserId(), request.getResourceName(), request.getStartTime(), request.getEndTime());
    }

    @GetMapping("/waitlist/user/{userId}")
    public List<WaitlistEntry> getUserWaitlist(@PathVariable String userId) {
        return waitlistService.getUserWaitlist(userId);
    }

    @DeleteMapping("/waitlist/{id}")
    public void leaveWaitlist(@PathVariable String id, @RequestParam String userId) {
        waitlistService.leaveWaitlist(id, userId);
    }

    @PostMapping("/waitlist/{id}/claim")
    public boolean claimWaitlist(@PathVariable String id, @RequestParam String userId) {
        return waitlistService.claimWaitlist(id, userId);
    }

    // Admin - all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // Approve
    @PutMapping("/{id}/approve")
    public Booking approve(@PathVariable String id) {
        return bookingService.approveBooking(id);
    }

    // Reject
    @PutMapping("/{id}/reject")
    public Booking reject(@PathVariable String id, @RequestParam String reason) {
        return bookingService.rejectBooking(id, reason);
    }

    // Cancel
    @PutMapping("/{id}/cancel")
    public Booking cancel(@PathVariable String id) {
        return bookingService.cancelBooking(id);
    }

    // Verify QR Code
    @PostMapping("/verify")
    public QrCodeService.BookingVerificationResult verifyBooking(@RequestBody String qrContent) {
        return qrCodeService.verifyBooking(qrContent);
    }
}