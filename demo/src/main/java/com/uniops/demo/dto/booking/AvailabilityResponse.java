package com.uniops.demo.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {
    private boolean available;
    private List<String> nextAvailableSlots;
    private boolean canJoinWaitlist;
    private int waitlistPosition;
}
