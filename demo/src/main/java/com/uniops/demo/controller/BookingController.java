package com.uniops.demo.controller;

import com.uniops.demo.model.Booking;
import com.uniops.demo.service.BookingService;
import com.uniops.demo.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin
public class BookingController {

    private final BookingService bookingService;
    private final QrCodeService qrCodeService;

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