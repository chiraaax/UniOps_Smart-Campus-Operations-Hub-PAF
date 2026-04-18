package com.sliit.smartcampus.modules.user.repository;

import com.sliit.smartcampus.modules.user.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // This custom method will let us search the database by Google email
    Optional<User> findByEmail(String email);
}