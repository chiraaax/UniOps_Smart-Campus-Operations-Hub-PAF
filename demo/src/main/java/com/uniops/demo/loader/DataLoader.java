package com.uniops.demo.loader;

import com.uniops.demo.entity.Asset;
import com.uniops.demo.entity.Facility;
import com.uniops.demo.enums.AssetType;
import com.uniops.demo.enums.FacilityType;
import com.uniops.demo.enums.ResourceStatus;
import com.uniops.demo.repository.AssetRepository;
import com.uniops.demo.repository.FacilityRepository;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final FacilityRepository facilityRepository;
    private final AssetRepository assetRepository;

    @Override
    public void run(String... args) {
                try {
                        loadFacilities();
                        loadAssets();
                } catch (Exception ex) {
                        log.warn("Skipping dev data loading because MongoDB is currently unavailable: {}", ex.getMessage());
                }
    }

    private void loadFacilities() {
        if (facilityRepository.count() == 0) {
            List<Facility> facilities = List.of(
                    Facility.builder()
                            .name("Lecture Hall A101")
                            .facilityType(FacilityType.LECTURE_HALL)
                            .capacity(120)
                            .location("Block A, Floor 1")
                            .availabilityStart(LocalTime.of(8, 0))
                            .availabilityEnd(LocalTime.of(18, 0))
                            .status(ResourceStatus.ACTIVE)
                            .build(),
                    Facility.builder()
                            .name("Computer Lab B204")
                            .facilityType(FacilityType.LAB)
                            .capacity(40)
                            .location("Block B, Floor 2")
                            .availabilityStart(LocalTime.of(8, 0))
                            .availabilityEnd(LocalTime.of(20, 0))
                            .status(ResourceStatus.ACTIVE)
                            .build(),
                    Facility.builder()
                            .name("Meeting Room C301")
                            .facilityType(FacilityType.MEETING_ROOM)
                            .capacity(15)
                            .location("Block C, Floor 3")
                            .availabilityStart(LocalTime.of(9, 0))
                            .availabilityEnd(LocalTime.of(17, 0))
                            .status(ResourceStatus.ACTIVE)
                            .build(),
                    Facility.builder()
                            .name("Lecture Hall D102")
                            .facilityType(FacilityType.LECTURE_HALL)
                            .capacity(80)
                            .location("Block D, Floor 1")
                            .availabilityStart(LocalTime.of(8, 0))
                            .availabilityEnd(LocalTime.of(18, 0))
                            .status(ResourceStatus.OUT_OF_SERVICE)
                            .build(),
                    Facility.builder()
                            .name("Science Lab E105")
                            .facilityType(FacilityType.LAB)
                            .capacity(30)
                            .location("Block E, Floor 1")
                            .availabilityStart(LocalTime.of(8, 0))
                            .availabilityEnd(LocalTime.of(16, 0))
                            .status(ResourceStatus.UNDER_MAINTENANCE)
                            .build());

            facilityRepository.saveAll(facilities);
            log.info("Loaded {} facility records for dev profile", facilities.size());
        }
    }

    private void loadAssets() {
        if (assetRepository.count() == 0) {
            List<Asset> assets = List.of(
                    Asset.builder()
                            .name("Epson Projector 01")
                            .assetType(AssetType.PROJECTOR)
                            .assetSubtype("Projector")
                            .serialNumber("EP-001")
                            .location("IT Store Room B3")
                            .availabilityStart(LocalTime.of(8, 0))
                            .availabilityEnd(LocalTime.of(18, 0))
                            .status(ResourceStatus.ACTIVE)
                            .build(),
                    Asset.builder()
                            .name("Canon DSLR Camera")
                            .assetType(AssetType.CAMERA)
                            .assetSubtype("DSLR Camera")
                            .serialNumber("CA-001")
                            .location("Media Lab")
                            .availabilityStart(LocalTime.of(9, 0))
                            .availabilityEnd(LocalTime.of(17, 0))
                            .status(ResourceStatus.ACTIVE)
                            .build(),
                    Asset.builder()
                            .name("Dell Laptop 05")
                            .assetType(AssetType.LAPTOP)
                            .assetSubtype("Laptop")
                            .serialNumber("DL-005")
                            .location("IT Store Room B3")
                            .availabilityStart(LocalTime.of(8, 0))
                            .availabilityEnd(LocalTime.of(20, 0))
                            .status(ResourceStatus.ACTIVE)
                            .build(),
                    Asset.builder()
                            .name("Bose Speaker Set")
                            .assetType(AssetType.AUDIO_EQUIPMENT)
                            .assetSubtype("Speaker")
                            .serialNumber("BS-001")
                            .location("Events Hall")
                            .availabilityStart(LocalTime.of(8, 0))
                            .availabilityEnd(LocalTime.of(22, 0))
                            .status(ResourceStatus.ACTIVE)
                            .build(),
                    Asset.builder()
                            .name("Epson Projector 02")
                            .assetType(AssetType.PROJECTOR)
                            .assetSubtype("Projector")
                            .serialNumber("EP-002")
                            .location("Block A, Floor 2")
                            .availabilityStart(LocalTime.of(8, 0))
                            .availabilityEnd(LocalTime.of(18, 0))
                            .status(ResourceStatus.OUT_OF_SERVICE)
                            .build());

            assetRepository.saveAll(assets);
            log.info("Loaded {} asset records for dev profile", assets.size());
        }
    }
}
