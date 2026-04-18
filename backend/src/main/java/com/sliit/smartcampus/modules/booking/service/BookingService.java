package com.sliit.smartcampus.modules.booking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sliit.smartcampus.common.enums.BookingStatus;
import com.sliit.smartcampus.modules.booking.model.Booking;
import com.sliit.smartcampus.modules.booking.repository.BookingRepository;
import com.sliit.smartcampus.modules.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService; // <-- Injecting Notification logic here

    public Booking createBooking(Booking booking) {
        // 1. Check for time conflicts. We only care about APPROVED or PENDING overlapping bookings.
        List<BookingStatus> blockingStatuses = List.of(BookingStatus.APPROVED, BookingStatus.PENDING);
        
        List<Booking> conflicts = bookingRepository.findByFacilityIdAndStatusInAndEndTimeGreaterThanAndStartTimeLessThan(
                booking.getFacilityId(), 
                blockingStatuses, 
                booking.getStartTime(), 
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("This facility is already booked or has a pending request during this time.");
        }

        // 2. No conflicts found, save it as PENDING.
        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking updateBookingStatus(String bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(newStatus);
        Booking savedBooking = bookingRepository.save(booking);

        // 3. AUTO-NOTIFICATION LOGIC: Fire a notification if approved or rejected!
        if (newStatus == BookingStatus.APPROVED || newStatus == BookingStatus.REJECTED) {
            String title = "Booking " + newStatus.name();
            String message = "Your request for " + booking.getFacilityName() + " has been " + newStatus.name().toLowerCase() + ".";
            notificationService.createNotification(booking.getUserId(), title, message);
        }

        return savedBooking;
    }
}