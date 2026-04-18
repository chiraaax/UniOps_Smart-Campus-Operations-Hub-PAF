package com.sliit.smartcampus.modules.facility.service;

import com.sliit.smartcampus.modules.facility.model.Facility;
import com.sliit.smartcampus.modules.facility.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility createFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    // --- MUST HAVE: DELETE ---
    public void deleteFacility(String id) {
        facilityRepository.deleteById(id);
    }

    // --- MUST HAVE: UPDATE ---
    public Facility updateFacility(String id, Facility updatedFacility) {
        return facilityRepository.findById(id).map(existingFacility -> {
            existingFacility.setName(updatedFacility.getName());
            existingFacility.setType(updatedFacility.getType());
            existingFacility.setCapacity(updatedFacility.getCapacity());
            existingFacility.setLocation(updatedFacility.getLocation());
            existingFacility.setOpenTime(updatedFacility.getOpenTime());
            existingFacility.setCloseTime(updatedFacility.getCloseTime());
            existingFacility.setStatus(updatedFacility.getStatus());
            
            if (updatedFacility.getImageUrl() != null && !updatedFacility.getImageUrl().isEmpty()) {
                existingFacility.setImageUrl(updatedFacility.getImageUrl());
            }
            
            return facilityRepository.save(existingFacility);
        }).orElseThrow(() -> new RuntimeException("Facility not found"));
    }
}