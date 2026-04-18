package com.sliit.smartcampus.modules.incident.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.sliit.smartcampus.modules.incident.model.IncidentTicket;

public interface IncidentTicketRepository extends MongoRepository<IncidentTicket, String> {
    List<IncidentTicket> findByReportedByUserId(String userId);
}