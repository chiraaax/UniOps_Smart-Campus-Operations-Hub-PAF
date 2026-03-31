package com.uniops.demo.service;

import com.uniops.demo.model.Booking;
import com.uniops.demo.model.BookingStatus;
import com.uniops.demo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {
        if (booking.getStatus() == null) {
            booking.setStatus(BookingStatus.PENDING);
        }
        return bookingRepository.save(booking);
    }

    public Optional<Booking> updateBooking(Long id, Booking bookingDetails) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setFacility(bookingDetails.getFacility());
            booking.setStartTime(bookingDetails.getStartTime());
            booking.setEndTime(bookingDetails.getEndTime());
            booking.setPurpose(bookingDetails.getPurpose());
            booking.setExpectedAttendees(bookingDetails.getExpectedAttendees());
            booking.setStatus(bookingDetails.getStatus());
            booking.setRejectionReason(bookingDetails.getRejectionReason());
            return bookingRepository.save(booking);
        });
    }

    public boolean deleteBooking(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Booking> updateBookingStatus(Long id, BookingStatus status) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus(status);
            return bookingRepository.save(booking);
        });
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByFacility(Long facilityId) {
        return bookingRepository.findByFacilityId(facilityId);
    }
}