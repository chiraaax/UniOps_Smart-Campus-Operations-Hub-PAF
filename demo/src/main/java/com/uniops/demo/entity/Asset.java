package com.uniops.demo.entity;

import com.uniops.demo.enums.AssetType;
import com.uniops.demo.enums.ResourceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotNull
    private AssetType assetType;

    private String assetSubtype;

    private String serialNumber;

    @NotBlank
    private String location;

    private String description;

    @NotNull
    private LocalTime availabilityStart;

    @NotNull
    private LocalTime availabilityEnd;

    private LocalDate bookingDate;

    @NotNull
    private ResourceStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
