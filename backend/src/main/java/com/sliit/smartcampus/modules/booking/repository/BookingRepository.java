package com.sliit.smartcampus.modules.booking.repository;

import com.sliit.smartcampus.modules.booking.model.Booking;
import com.sliit.smartcampus.common.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Find all bookings for a specific user
    List<Booking> findByUserId(String userId);
    
    // Core logic: Find overlapping bookings for a specific facility to prevent double-booking
    List<Booking> findByFacilityIdAndStatusInAndEndTimeGreaterThanAndStartTimeLessThan(
            String facilityId, 
            List<BookingStatus> statuses, 
            LocalDateTime newStartTime, 
            LocalDateTime newEndTime
    );
}