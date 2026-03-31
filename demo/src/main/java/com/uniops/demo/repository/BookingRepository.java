package com.uniops.demo.repository;

import com.uniops.demo.model.Booking;
import com.uniops.demo.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByFacilityId(Long facilityId);
}
