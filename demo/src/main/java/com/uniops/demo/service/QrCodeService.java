package com.uniops.demo.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.uniops.demo.model.Booking;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class QrCodeService {

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
        if (qrContent == null || !qrContent.startsWith("BOOKING_ID:")) {
            return new BookingVerificationResult(false, "Invalid QR code format", null, null, null, null);
        }

        try {
            String[] parts = qrContent.split("\\|");
            if (parts.length < 6) {
                return new BookingVerificationResult(false, "Invalid QR code data", null, null, null, null);
            }

            String bookingId = parts[0].substring("BOOKING_ID:".length());
            String resource = parts[1].substring("RESOURCE:".length());
            String startTime = parts[2].substring("START:".length());
            String endTime = parts[3].substring("END:".length());
            String userId = parts[4].substring("USER:".length());
            String status = parts[5].substring("STATUS:".length());

            boolean isValid = "APPROVED".equals(status);

            String message = isValid ? "Valid booking" : "Booking is not approved";

            return new BookingVerificationResult(
                isValid,
                message,
                bookingId,
                resource,
                userId,
                startTime + " to " + endTime
            );

        } catch (Exception e) {
            return new BookingVerificationResult(false, "Error parsing QR code", null, null, null, null);
        }
    }

    public static class BookingVerificationResult {
        private final boolean valid;
        private final String message;
        private final String bookingId;
        private final String resourceName;
        private final String userId;
        private final String dateTime;

        public BookingVerificationResult(boolean valid, String message, String bookingId,
                                       String resourceName, String userId, String dateTime) {
            this.valid = valid;
            this.message = message;
            this.bookingId = bookingId;
            this.resourceName = resourceName;
            this.userId = userId;
            this.dateTime = dateTime;
        }

        // Getters
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public String getBookingId() { return bookingId; }
        public String getResourceName() { return resourceName; }
        public String getUserId() { return userId; }
        public String getDateTime() { return dateTime; }
    }
}