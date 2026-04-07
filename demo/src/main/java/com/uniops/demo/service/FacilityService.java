package com.uniops.demo.service;

import com.uniops.demo.dto.facility.FacilityRequestDTO;
import com.uniops.demo.dto.facility.FacilityResponseDTO;
import com.uniops.demo.enums.FacilityType;
import com.uniops.demo.enums.ResourceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FacilityService {

    /**
     * Creates a new facility resource.
     *
     * @param dto facility payload
     * @return created facility response
     */
    FacilityResponseDTO createFacility(FacilityRequestDTO dto);

    /**
     * Retrieves a facility by its identifier.
     *
     * @param id facility identifier
     * @return facility response
     */
    FacilityResponseDTO getFacilityById(String id);

    /**
     * Retrieves all facilities as a paginated result.
     *
     * @param pageable pagination and sorting configuration
     * @return paginated facilities
     */
    Page<FacilityResponseDTO> getAllFacilities(Pageable pageable);

    /**
     * Searches facilities using dynamic optional filters.
     *
     * @param type optional facility type
     * @param status optional status
     * @param location optional location fragment
     * @param minCapacity optional minimum capacity
     * @param pageable pagination and sorting configuration
     * @return paginated matching facilities
     */
    Page<FacilityResponseDTO> searchFacilities(
            FacilityType type,
            ResourceStatus status,
            String location,
            Integer minCapacity,
            Pageable pageable);

    /**
     * Fully updates a facility by its identifier.
     *
     * @param id facility identifier
     * @param dto full update payload
     * @return updated facility response
     */
    FacilityResponseDTO updateFacility(String id, FacilityRequestDTO dto);

    /**
     * Updates only the status field of a facility.
     *
     * @param id facility identifier
     * @param status new status value
     * @return updated facility response
     */
    FacilityResponseDTO updateFacilityStatus(String id, ResourceStatus status);

    /**
     * Deletes a facility by its identifier.
     *
     * @param id facility identifier
     */
    void deleteFacility(String id);
}
