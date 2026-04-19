package com.sliit.smartcampus.modules.facility.service;

import com.sliit.smartcampus.common.enums.BookingStatus;
import com.sliit.smartcampus.common.enums.FacilityStatus; // <-- NEW IMPORT
import com.sliit.smartcampus.modules.booking.model.Booking;
import com.sliit.smartcampus.modules.booking.repository.BookingRepository;
import com.sliit.smartcampus.modules.facility.model.Facility;
import com.sliit.smartcampus.modules.facility.model.FacilityLiveStatusDTO;
import com.sliit.smartcampus.modules.facility.repository.FacilityRepository;
import com.sliit.smartcampus.modules.incident.model.IncidentTicket;
import com.sliit.smartcampus.modules.incident.model.enums.TicketStatus;
import com.sliit.smartcampus.modules.incident.repository.IncidentTicketRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;
    private final BookingRepository bookingRepository; // Inject to check live bookings
    private final IncidentTicketRepository incidentRepository; // Inject to check live incidents

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility createFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    public void deleteFacility(String id) {
        facilityRepository.deleteById(id);
    }

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

    // --- NEW: THE LIVE STATUS FUSION ENGINE ---
    public List<FacilityLiveStatusDTO> getFacilitiesWithLiveStatus() {
        List<Facility> allFacilities = facilityRepository.findAll();
        List<FacilityLiveStatusDTO> liveList = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Facility fac : allFacilities) {
            FacilityLiveStatusDTO dto = new FacilityLiveStatusDTO();
            dto.setFacility(fac);
            
            // Default Status
            dto.setLiveStatus("AVAILABLE NOW");
            dto.setStatusColor("#198754"); // Green
            dto.setCurrentActivity("Ready for booking");

            // 1. Check Hard Database Status First (FIXED ENUM COMPARISON)
            if (fac.getStatus() != null && fac.getStatus() == FacilityStatus.OUT_OF_SERVICE) {
                dto.setLiveStatus("OUT OF SERVICE");
                dto.setStatusColor("#6c757d"); // Gray
                dto.setCurrentActivity("Manually marked as unavailable");
                liveList.add(dto);
                continue; // Skip further checks
            }

            // 2. Check for Active Incidents (Takes Priority over Bookings)
            List<IncidentTicket> activeIncidents = incidentRepository.findAll().stream()
                .filter(t -> t.getResourceId() != null && t.getResourceId().equals(fac.getId()))
                .filter(t -> t.getStatus() == TicketStatus.OPEN || t.getStatus() == TicketStatus.IN_PROGRESS)
                .toList();

            if (!activeIncidents.isEmpty()) {
                dto.setLiveStatus("UNDER MAINTENANCE");
                dto.setStatusColor("#ffc107"); // Yellow/Orange
                dto.setCurrentActivity("Tech assigned: " + activeIncidents.get(0).getCategory());
                liveList.add(dto);
                continue;
            }

            // 3. Check for Live Bookings Happening RIGHT NOW
            List<Booking> liveBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getFacilityId() != null && b.getFacilityId().equals(fac.getId()))
                .filter(b -> b.getStatus() == BookingStatus.APPROVED)
                .filter(b -> b.getStartTime() != null && b.getEndTime() != null)
                .filter(b -> now.isAfter(b.getStartTime()) && now.isBefore(b.getEndTime()))
                .toList();

            if (!liveBookings.isEmpty()) {
                Booking current = liveBookings.get(0);
                dto.setLiveStatus("🔴 IN USE");
                dto.setStatusColor("#dc3545"); // Red
                
                // Format end time nicely (e.g. 14:30)
                String endTime = String.format("%02d:%02d", current.getEndTime().getHour(), current.getEndTime().getMinute());
                dto.setCurrentActivity(current.getPurpose() + " (Until " + endTime + ")");
            }

            liveList.add(dto);
        }

        return liveList;
    }
}