package com.uniops.demo.repository;

import com.uniops.demo.model.WaitlistEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface WaitlistRepository extends MongoRepository<WaitlistEntry, String> {

    List<WaitlistEntry> findByResourceNameAndStatusOrderByCreatedAtAsc(String resourceName, String status);

    List<WaitlistEntry> findByUserIdAndStatus(String userId, String status);

    List<WaitlistEntry> findByResourceNameAndStartTimeBetween(String resourceName, LocalDateTime start, LocalDateTime end);

    List<WaitlistEntry> findByStatus(String status);
}
