package com.uniops.demo.service.impl;

import com.uniops.demo.dto.facility.FacilityRequestDTO;
import com.uniops.demo.dto.facility.FacilityResponseDTO;
import com.uniops.demo.enums.FacilityType;
import com.uniops.demo.enums.ResourceStatus;
import com.uniops.demo.model.Facility;
import com.uniops.demo.repository.FacilityRepository;
import com.uniops.demo.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;
    private final ModelMapper modelMapper;

    @Override
    public FacilityResponseDTO createFacility(FacilityRequestDTO dto) {
        Facility facility = modelMapper.map(dto, Facility.class);
        facility.setCreatedAt(LocalDateTime.now());
        facility.setUpdatedAt(LocalDateTime.now());
        Facility saved = facilityRepository.save(facility);
        return modelMapper.map(saved, FacilityResponseDTO.class);
    }

    @Override
    public FacilityResponseDTO getFacilityById(String id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
        return modelMapper.map(facility, FacilityResponseDTO.class);
    }

    @Override
    public Page<FacilityResponseDTO> getAllFacilities(Pageable pageable) {
        return facilityRepository.findAll(pageable)
                .map(facility -> modelMapper.map(facility, FacilityResponseDTO.class));
    }

    @Override
    public Page<FacilityResponseDTO> searchFacilities(
            FacilityType type,
            ResourceStatus status,
            String location,
            Integer minCapacity,
            Pageable pageable) {
        // Simple implementation for now, can be improved with QueryDSL or Criteria API
        return facilityRepository.findAll(pageable)
                .map(facility -> modelMapper.map(facility, FacilityResponseDTO.class));
    }

    @Override
    public FacilityResponseDTO updateFacility(String id, FacilityRequestDTO dto) {
        Facility existing = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
        
        modelMapper.map(dto, existing);
        existing.setUpdatedAt(LocalDateTime.now());
        Facility updated = facilityRepository.save(existing);
        return modelMapper.map(updated, FacilityResponseDTO.class);
    }

    @Override
    public FacilityResponseDTO updateFacilityStatus(String id, ResourceStatus status) {
        Facility existing = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
        
        existing.setStatus(status);
        existing.setUpdatedAt(LocalDateTime.now());
        Facility updated = facilityRepository.save(existing);
        return modelMapper.map(updated, FacilityResponseDTO.class);
    }

    @Override
    public void deleteFacility(String id) {
        if (!facilityRepository.existsById(id)) {
            throw new RuntimeException("Facility not found with id: " + id);
        }
        facilityRepository.deleteById(id);
    }
}
