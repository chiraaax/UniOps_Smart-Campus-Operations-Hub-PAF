package com.sliit.smartcampus.modules.facility.model;

import lombok.Data;

@Data
public class FacilityLiveStatusDTO {
    private Facility facility;
    private String liveStatus; // e.g., "AVAILABLE NOW", "IN USE", "UNDER MAINTENANCE"
    private String statusColor; // e.g., "#198754" (Green), "#dc3545" (Red), "#ffc107" (Yellow)
    private String currentActivity; // Short description of what is happening
}