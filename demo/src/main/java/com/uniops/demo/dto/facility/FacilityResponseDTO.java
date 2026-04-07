package com.uniops.demo.dto.facility;

import com.uniops.demo.enums.FacilityType;
import com.uniops.demo.enums.ResourceStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacilityResponseDTO {

    private String id;
    private String name;
    private FacilityType facilityType;
    private Integer capacity;
    private String location;
    private String description;
    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
    private LocalDate bookingDate;
    private ResourceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

