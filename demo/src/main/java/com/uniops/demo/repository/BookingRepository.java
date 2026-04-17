package com.uniops.demo.repository;

import com.uniops.demo.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    // Check overlapping bookings
    List<Booking> findByResourceNameAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceName,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    List<Booking> findByResourceNameAndStartTimeBetween(String resourceName, LocalDateTime start, LocalDateTime end);
}