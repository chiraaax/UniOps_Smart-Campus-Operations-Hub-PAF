package com.uniops.demo.dto.facility;

import java.time.LocalDate;
import java.time.LocalTime;

import com.uniops.demo.enums.FacilityType;
import com.uniops.demo.enums.ResourceStatus;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacilityRequestDTO {
   
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    @Pattern(regexp = "^[A-Za-z0-9][A-Za-z0-9 .,'()/#-]*$", message = "Name contains invalid characters")
    private String name;

    @NotNull(message = "Facility type is required")
    private FacilityType facilityType;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 10000, message = "Capacity cannot exceed 10000")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    @Size(min = 3, max = 120, message = "Location must be between 3 and 120 characters")
    @Pattern(regexp = "^[A-Za-z0-9][A-Za-z0-9 .,'()/#-]*$", message = "Location contains invalid characters")
    private String location;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Availability start time is required")
    private LocalTime availabilityStart;

    @NotNull(message = "Availability end time is required")
    private LocalTime availabilityEnd;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    @AssertTrue(message = "Availability end time must be after start time")
    public boolean isAvailabilityWindowValid() {
        if (availabilityStart == null || availabilityEnd == null) {
            return true;
        }
        return availabilityEnd.isAfter(availabilityStart);
    }
}
