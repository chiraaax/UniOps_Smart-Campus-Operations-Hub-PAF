package com.uniops.demo.repository;

import com.uniops.demo.model.Facility;
import com.uniops.demo.enums.FacilityType;
import com.uniops.demo.enums.ResourceStatus;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FacilityRepository extends MongoRepository<Facility, String> {

    List<Facility> findByFacilityType(FacilityType type);

    List<Facility> findByStatus(ResourceStatus status);

    List<Facility> findByLocationContainingIgnoreCase(String location);

    List<Facility> findByCapacityGreaterThanEqual(Integer minCapacity);
}

