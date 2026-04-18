package com.sliit.smartcampus.modules.incident.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketComment {
    private String id;
    private String userId;
    private String text;
    private LocalDateTime timestamp;
}
