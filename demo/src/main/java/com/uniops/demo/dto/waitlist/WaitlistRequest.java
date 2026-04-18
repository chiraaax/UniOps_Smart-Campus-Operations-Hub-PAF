package com.uniops.demo.dto.waitlist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WaitlistRequest {
    private String userId;
    private String resourceName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
