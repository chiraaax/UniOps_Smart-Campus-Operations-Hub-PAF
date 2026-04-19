package com.sliit.smartcampus.modules.facility.repository;

import com.sliit.smartcampus.modules.facility.model.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
    // Because this extends MongoRepository, Spring Boot will automatically 
    // create the findAll() and save() methods for us behind the scenes!
}