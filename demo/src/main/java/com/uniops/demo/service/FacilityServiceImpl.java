package com.uniops.demo.service;

import com.uniops.demo.dto.facility.FacilityRequestDTO;
import com.uniops.demo.dto.facility.FacilityResponseDTO;
import com.uniops.demo.entity.Facility;
import com.uniops.demo.enums.FacilityType;
import com.uniops.demo.enums.ResourceStatus;
import com.uniops.demo.exception.ResourceNotFoundException;
import com.uniops.demo.repository.FacilityRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;
    private final ModelMapper modelMapper;
    private final MongoTemplate mongoTemplate;

    @Override
    public FacilityResponseDTO createFacility(FacilityRequestDTO dto) {
        log.info("Creating facility: {}", dto.getName());
        Facility facility = modelMapper.map(dto, Facility.class);
        LocalDateTime now = LocalDateTime.now();
        facility.setCreatedAt(now);
        facility.setUpdatedAt(now);
        Facility saved = facilityRepository.save(facility);
        return toResponseDto(saved);
    }

    @Override
    public FacilityResponseDTO getFacilityById(String id) {
        log.info("Fetching facility with id: {}", id);
        Facility facility = findFacilityById(id);
        return toResponseDto(facility);
    }

    @Override
    public Page<FacilityResponseDTO> getAllFacilities(Pageable pageable) {
        return facilityRepository.findAll(pageable).map(this::toResponseDto);
    }

    @Override
    public Page<FacilityResponseDTO> searchFacilities(
            FacilityType type,
            ResourceStatus status,
            String location,
            Integer minCapacity,
            Pageable pageable) {

        Query query = new Query();

        if (type != null) {
            query.addCriteria(Criteria.where("facilityType").is(type));
        }
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        if (location != null && !location.isBlank()) {
            query.addCriteria(Criteria.where("location").regex(location, "i"));
        }
        if (minCapacity != null) {
            query.addCriteria(Criteria.where("capacity").gte(minCapacity));
        }

        long total = mongoTemplate.count(query, Facility.class);
        query.with(pageable);

        List<Facility> facilities = mongoTemplate.find(query, Facility.class);
        return new PageImpl<>(facilities, pageable, total).map(this::toResponseDto);
    }

    @Override
    public FacilityResponseDTO updateFacility(String id, FacilityRequestDTO dto) {
        Facility facility = findFacilityById(id);

        facility.setName(dto.getName());
        facility.setFacilityType(dto.getFacilityType());
        facility.setCapacity(dto.getCapacity());
        facility.setLocation(dto.getLocation());
        facility.setDescription(dto.getDescription());
        facility.setAvailabilityStart(dto.getAvailabilityStart());
        facility.setAvailabilityEnd(dto.getAvailabilityEnd());
        facility.setBookingDate(dto.getBookingDate());
        facility.setStatus(dto.getStatus());
        facility.setUpdatedAt(LocalDateTime.now());

        Facility updated = facilityRepository.save(facility);
        return toResponseDto(updated);
    }

    @Override
    public FacilityResponseDTO updateFacilityStatus(String id, ResourceStatus status) {
        log.info("Updating facility status to: {}", status);
        Facility facility = findFacilityById(id);
        facility.setStatus(status);
        facility.setUpdatedAt(LocalDateTime.now());
        Facility updated = facilityRepository.save(facility);
        return toResponseDto(updated);
    }

    @Override
    public void deleteFacility(String id) {
        Facility facility = findFacilityById(id);
        facilityRepository.delete(facility);
    }

    private Facility findFacilityById(String id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));
    }

    private FacilityResponseDTO toResponseDto(Facility facility) {
        return modelMapper.map(facility, FacilityResponseDTO.class);
    }
}

