package com.uniops.demo.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.uniops.demo.model.Booking;
import com.uniops.demo.repository.BookingRepository;
import com.uniops.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QrCodeService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final QRCodeWriter qrCodeWriter = new QRCodeWriter();

    public String generateQrCode(Booking booking) throws WriterException, IOException {
        // Create QR code content with booking details
        String qrContent = String.format(
            "BOOKING_ID:%s|RESOURCE:%s|START:%s|END:%s|USER:%s|STATUS:%s",
            booking.getId(),
            booking.getResourceName(),
            booking.getStartTime().toString(),
            booking.getEndTime().toString(),
            booking.getUserId(),
            booking.getStatus()
        );

        // Generate QR code
        BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 200, 200);

        // Convert to PNG image
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

        // Convert to Base64 for storage/transmission
        byte[] qrCodeBytes = outputStream.toByteArray();
        return Base64.getEncoder().encodeToString(qrCodeBytes);
    }

    public boolean validateQrCode(String qrContent, String expectedBookingId) {
        if (qrContent == null || !qrContent.startsWith("BOOKING_ID:")) {
            return false;
        }

        // Parse QR content
        String[] parts = qrContent.split("\\|");
        if (parts.length < 6) {
            return false;
        }

        String bookingId = parts[0].substring("BOOKING_ID:".length());
        String status = parts[5].substring("STATUS:".length());

        // Check if booking ID matches and status is APPROVED
        return expectedBookingId.equals(bookingId) && "APPROVED".equals(status);
    }

    public BookingVerificationResult verifyBooking(String qrContent) {
        if (qrContent == null || qrContent.isBlank()) {
            return new BookingVerificationResult(false, "QR content or booking ID is required", null, null, null, null, null);
        }

        String bookingId;
        String resource = null;
        String userId = null;
        String dateTime = null;

        try {
            if (qrContent.startsWith("BOOKING_ID:")) {
                String[] parts = qrContent.split("\\|");
                if (parts.length < 6) {
                    return new BookingVerificationResult(false, "Invalid QR code data", null, null, null, null, null);
                }
                bookingId = parts[0].substring("BOOKING_ID:".length());
            } else {
                bookingId = qrContent.trim();
            }

            Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
            if (bookingOptional.isEmpty()) {
                return new BookingVerificationResult(false, "Booking not found", bookingId, null, null, null, null);
            }

            Booking booking = bookingOptional.get();
            boolean validStatus = "APPROVED".equals(booking.getStatus());
            boolean withinWindow = false;
            if (booking.getStartTime() != null && booking.getEndTime() != null) {
                LocalDateTime now = LocalDateTime.now();
                withinWindow = !now.isBefore(booking.getStartTime()) && !now.isAfter(booking.getEndTime());
            }

            boolean isValid = validStatus && withinWindow;
            String message;
            if (!validStatus) {
                message = "Booking is not approved";
            } else if (!withinWindow) {
                message = "Booking is not valid for this time";
            } else {
                message = "Valid booking";
            }

            resource = booking.getResourceName();
            userId = booking.getUserId();
            String userName = null;
            if (userId != null) {
                userName = userRepository.findById(userId).map(u -> u.getName()).orElse(null);
            }
            dateTime = booking.getStartTime() + " to " + booking.getEndTime();

            return new BookingVerificationResult(
                isValid,
                message,
                booking.getId(),
                resource,
                userId,
                userName,
                dateTime
            );
        } catch (Exception e) {
            return new BookingVerificationResult(false, "Error verifying booking", null, null, null, null, null);
        }
    }

    public static class BookingVerificationResult {
        private final boolean valid;
        private final String message;
        private final String bookingId;
        private final String resourceName;
        private final String userId;
        private final String userName;
        private final String dateTime;

        public BookingVerificationResult(boolean valid, String message, String bookingId,
                                         String resourceName, String userId, String userName, String dateTime) {
            this.valid = valid;
            this.message = message;
            this.bookingId = bookingId;
            this.resourceName = resourceName;
            this.userId = userId;
            this.userName = userName;
            this.dateTime = dateTime;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }

        public String getBookingId() {
            return bookingId;
        }

        public String getResourceName() {
            return resourceName;
        }

        public String getUserId() {
            return userId;
        }

        public String getUserName() {
            return userName;
        }

        public String getDateTime() {
            return dateTime;
        }
    }
}