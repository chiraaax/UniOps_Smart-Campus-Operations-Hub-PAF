package com.uniops.demo.service;

import com.uniops.demo.model.Facility;
import com.uniops.demo.model.FacilityType;
import com.uniops.demo.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Optional<Facility> getFacilityById(Long id) {
        return facilityRepository.findById(id);
    }

    public Facility createFacility(Facility facility) {
        if (facility.getAvailable() == null) {
            facility.setAvailable(true);
        }
        return facilityRepository.save(facility);
    }

    public Optional<Facility> updateFacility(Long id, Facility facilityDetails) {
        return facilityRepository.findById(id).map(facility -> {
            facility.setName(facilityDetails.getName());
            facility.setDescription(facilityDetails.getDescription());
            facility.setLocation(facilityDetails.getLocation());
            facility.setCapacity(facilityDetails.getCapacity());
            facility.setType(facilityDetails.getType());
            facility.setAvailable(facilityDetails.getAvailable());
            return facilityRepository.save(facility);
        });
    }

    public boolean deleteFacility(Long id) {
        if (facilityRepository.existsById(id)) {
            facilityRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Facility> getFacilitiesByType(FacilityType type) {
        return facilityRepository.findByType(type);
    }

    public List<Facility> getAvailableFacilities() {
        return facilityRepository.findByAvailable(true);
    }

    public List<Facility> getFacilitiesByLocation(String location) {
        return facilityRepository.findByLocation(location);
    }
}