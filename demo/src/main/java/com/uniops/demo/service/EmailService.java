package com.uniops.demo.service;

import com.uniops.demo.model.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendBookingApprovalEmail(Booking booking) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(getUserEmail(booking.getUserId())); // In real app, get from user service
        message.setSubject("Booking Approved - Smart Campus Operations Hub");
        message.setText(String.format(
            "Dear User,\n\n" +
            "Your booking request has been APPROVED!\n\n" +
            "Booking Details:\n" +
            "Booking ID: %s\n" +
            "Resource: %s\n" +
            "Purpose: %s\n" +
            "Date & Time: %s to %s\n" +
            "Attendees: %d\n\n" +
            "Your QR code for check-in has been generated. You can view and download your QR code " +
            "by logging into the Smart Campus portal and viewing your booking details.\n\n" +
            "Please bring your QR code (digital or printed) to the facility entrance for check-in.\n\n" +
            "Best regards,\n" +
            "Smart Campus Operations Hub Admin",
            booking.getId(),
            booking.getResourceName(),
            booking.getPurpose(),
            booking.getStartTime(),
            booking.getEndTime(),
            booking.getAttendees()
        ));

        mailSender.send(message);
    }

    public void sendBookingRejectionEmail(Booking booking) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(getUserEmail(booking.getUserId())); // In real app, get from user service
        message.setSubject("Booking Rejected - Smart Campus Operations Hub");
        message.setText(String.format(
            "Dear User,\n\n" +
            "Unfortunately, your booking request has been REJECTED.\n\n" +
            "Booking Details:\n" +
            "Resource: %s\n" +
            "Purpose: %s\n" +
            "Requested Time: %s to %s\n" +
            "Attendees: %d\n\n" +
            "Reason for rejection: %s\n\n" +
            "Please submit a new booking request if needed.\n\n" +
            "Best regards,\n" +
            "Smart Campus Operations Hub Admin",
            booking.getResourceName(),
            booking.getPurpose(),
            booking.getStartTime(),
            booking.getEndTime(),
            booking.getAttendees(),
            booking.getAdminReason()
        ));

        mailSender.send(message);
    }

    // TODO: In a real application, this should fetch the user's email from a User service
    private String getUserEmail(String userId) {
        // For demo purposes, return a placeholder email
        // In production, integrate with user management system
        return "user" + userId + "@example.com";
    }
}