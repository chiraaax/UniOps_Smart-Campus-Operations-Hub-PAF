package com.sliit.smartcampus.modules.booking.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    private final NotificationService notificationService;

    public Booking createBooking(Booking booking) {
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

        if (newStatus == BookingStatus.APPROVED || newStatus == BookingStatus.REJECTED) {
            String title = "Booking " + newStatus.name();
            String message = "Your request for " + booking.getFacilityName() + " has been " + newStatus.name().toLowerCase() + ".";
            
            // --- UPDATED ARGUMENTS FOR CLICKABLE NOTIFICATIONS ---
            notificationService.createNotification(booking.getUserId(), title, message, "BOOKING", booking.getId());
        }

        return savedBooking;
    }

    // --- QR CODE CHECK-IN LOGIC ---
    public Booking checkInBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED bookings can be checked in.");
        }

        if (booking.isCheckedIn()) {
            throw new RuntimeException("Student is already checked in for this booking.");
        }

        booking.setCheckedIn(true);
        return bookingRepository.save(booking);
    }

    // --- ANALYTICS METHOD ---
    public Map<String, Object> getBookingAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        try {
            List<Booking> allBookings = bookingRepository.findAll();
            System.out.println("---- ANALYTICS ENGINE RUNNING ----");
            System.out.println("Total Bookings Found in DB: " + allBookings.size());

            long totalBookings = allBookings.size();
            long approvedBookings = allBookings.stream()
                    .filter(b -> b.getStatus() != null && b.getStatus() == BookingStatus.APPROVED)
                    .count();

            Map<String, Long> facilityCounts = allBookings.stream()
                    .filter(b -> b.getFacilityName() != null && !b.getFacilityName().trim().isEmpty())
                    .collect(Collectors.groupingBy(Booking::getFacilityName, Collectors.counting()));

            Map<String, Long> topFacilities = facilityCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));

            Map<Integer, Long> hourCounts = allBookings.stream()
                    .filter(b -> b.getStartTime() != null)
                    .collect(Collectors.groupingBy(b -> b.getStartTime().getHour(), Collectors.counting()));

            Map<String, Long> peakHours = hourCounts.entrySet().stream()
                    .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
                    .limit(5)
                    .collect(Collectors.toMap(
                            e -> String.format("%02d:00", e.getKey()), 
                            Map.Entry::getValue, 
                            (e1, e2) -> e1, 
                            LinkedHashMap::new
                    ));

            analytics.put("totalBookings", totalBookings);
            analytics.put("approvedBookings", approvedBookings);
            analytics.put("topFacilities", topFacilities.isEmpty() ? new HashMap<String, Long>() : topFacilities);
            analytics.put("peakHours", peakHours.isEmpty() ? new HashMap<String, Long>() : peakHours);
            
            System.out.println("Analytics calculated successfully! Total: " + totalBookings + ", Approved: " + approvedBookings);

        } catch (Exception e) {
            System.err.println("CRASH IN ANALYTICS ENGINE: " + e.getMessage());
            e.printStackTrace(); 
            
            analytics.put("totalBookings", 0);
            analytics.put("approvedBookings", 0);
            analytics.put("topFacilities", new HashMap<String, Long>());
            analytics.put("peakHours", new HashMap<String, Long>());
        }

        return analytics;
    }
}