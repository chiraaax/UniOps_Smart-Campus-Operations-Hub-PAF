package com.uniops.demo.dto.asset;

import com.uniops.demo.enums.AssetType;
import com.uniops.demo.enums.ResourceStatus;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetRequestDTO {

    @NotBlank(message = "Asset name is required")
    @Size(min = 3, max = 100, message = "Asset name must be between 3 and 100 characters")
    @Pattern(regexp = "^[A-Za-z0-9][A-Za-z0-9 .,'()/#-]*$", message = "Asset name contains invalid characters")
    private String name;

    @NotNull(message = "Asset type is required")
    private AssetType assetType;

        @Size(max = 100, message = "Asset subtype cannot exceed 100 characters")
        @Pattern(
            regexp = "^$|^[A-Za-z0-9][A-Za-z0-9 .,'()/#-]*$",
            message = "Asset subtype contains invalid characters")
    private String assetSubtype;

        @Size(max = 50, message = "Serial number cannot exceed 50 characters")
        @Pattern(
            regexp = "^$|^[A-Za-z0-9][A-Za-z0-9_\\/-]*$",
            message = "Serial number contains invalid characters")
    private String serialNumber;

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

