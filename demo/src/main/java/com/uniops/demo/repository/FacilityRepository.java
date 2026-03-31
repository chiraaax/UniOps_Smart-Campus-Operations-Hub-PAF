package com.uniops.demo.repository;

import com.uniops.demo.model.Facility;
import com.uniops.demo.model.FacilityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    List<Facility> findByType(FacilityType type);

    List<Facility> findByAvailable(Boolean available);

    List<Facility> findByLocation(String location);
}