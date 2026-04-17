package com.uniops.demo.service;

import com.uniops.demo.model.Booking;
import com.uniops.demo.model.User;
import com.uniops.demo.model.WaitlistEntry;
import com.uniops.demo.repository.BookingRepository;
import com.uniops.demo.repository.UserRepository;
import com.uniops.demo.repository.WaitlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WaitlistService {

    private static final String STATUS_WAITING = "WAITING";
    private static final String STATUS_NOTIFIED = "NOTIFIED";
    private static final String STATUS_CLAIMED = "CLAIMED";
    private static final String STATUS_EXPIRED = "EXPIRED";
    private static final String STATUS_CANCELLED = "CANCELLED";

    private final WaitlistRepository waitlistRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public WaitlistEntry joinWaitlist(String userId, String resourceName, LocalDateTime startTime, LocalDateTime endTime) {
        // If the slot is actually available, do not add to the waitlist.
        List<Booking> conflicts = bookingRepository.findByResourceNameAndStartTimeLessThanAndEndTimeGreaterThan(
                resourceName, endTime, startTime
        );
        if (conflicts.isEmpty()) {
            throw new RuntimeException("Slot is available; please book directly instead of joining the waitlist.");
        }

        WaitlistEntry entry = WaitlistEntry.builder()
                .resourceName(resourceName)
                .userId(userId)
                .status(STATUS_WAITING)
                .startTime(startTime)
                .endTime(endTime)
                .createdAt(LocalDateTime.now())
                .build();

        return waitlistRepository.save(entry);
    }

    public List<WaitlistEntry> getUserWaitlist(String userId) {
        return waitlistRepository.findByUserIdAndStatus(userId, STATUS_WAITING);
    }

    public void leaveWaitlist(String entryId, String userId) {
        Optional<WaitlistEntry> entryOptional = waitlistRepository.findById(entryId);
        WaitlistEntry entry = entryOptional.orElseThrow(() -> new RuntimeException("Waitlist entry not found"));
        if (!entry.getUserId().equals(userId)) {
            throw new RuntimeException("Cannot leave another user's waitlist entry");
        }
        entry.setStatus(STATUS_CANCELLED);
        waitlistRepository.save(entry);
    }

    public int getWaitlistPosition(String userId, String resourceName, LocalDateTime startTime, LocalDateTime endTime) {
        List<WaitlistEntry> queue = waitlistRepository.findByResourceNameAndStatusOrderByCreatedAtAsc(resourceName, STATUS_WAITING);
        int position = 1;
        for (WaitlistEntry entry : queue) {
            if (entry.getUserId().equals(userId)
                    && entry.getStartTime().equals(startTime)
                    && entry.getEndTime().equals(endTime)) {
                return position;
            }
            position++;
        }
        return -1;
    }

    public void notifyNextWaitlistEntry(String resourceName, LocalDateTime startTime, LocalDateTime endTime) {
        List<WaitlistEntry> queue = waitlistRepository.findByResourceNameAndStatusOrderByCreatedAtAsc(resourceName, STATUS_WAITING);
        for (WaitlistEntry entry : queue) {
            if (entry.getStartTime().equals(startTime) && entry.getEndTime().equals(endTime)) {
                entry.setStatus(STATUS_NOTIFIED);
                entry.setNotifiedAt(LocalDateTime.now());
                entry.setExpiresAt(LocalDateTime.now().plusHours(2));
                waitlistRepository.save(entry);

                Optional<User> userOptional = userRepository.findById(entry.getUserId());
                if (userOptional.isPresent()) {
                    emailService.sendWaitlistNotificationEmail(userOptional.get(), entry);
                }
                break;
            }
        }
    }

    public boolean claimWaitlist(String entryId, String userId) {
        WaitlistEntry entry = waitlistRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Waitlist entry not found"));
        if (!entry.getUserId().equals(userId)) {
            throw new RuntimeException("Cannot claim another user's waitlist slot");
        }
        if (!STATUS_NOTIFIED.equals(entry.getStatus())) {
            throw new RuntimeException("Waitlist slot is not currently available for claiming");
        }
        if (entry.getExpiresAt() != null && LocalDateTime.now().isAfter(entry.getExpiresAt())) {
            entry.setStatus(STATUS_EXPIRED);
            waitlistRepository.save(entry);
            notifyNextWaitlistEntry(entry.getResourceName(), entry.getStartTime(), entry.getEndTime());
            return false;
        }
        entry.setStatus(STATUS_CLAIMED);
        waitlistRepository.save(entry);
        return true;
    }

    public void expireNotifiedEntries() {
        List<WaitlistEntry> notifiedEntries = waitlistRepository.findByStatus(STATUS_NOTIFIED);
        LocalDateTime now = LocalDateTime.now();
        for (WaitlistEntry entry : notifiedEntries) {
            if (entry.getExpiresAt() != null && now.isAfter(entry.getExpiresAt())) {
                entry.setStatus(STATUS_EXPIRED);
                waitlistRepository.save(entry);
                notifyNextWaitlistEntry(entry.getResourceName(), entry.getStartTime(), entry.getEndTime());
            }
        }
    }
}
