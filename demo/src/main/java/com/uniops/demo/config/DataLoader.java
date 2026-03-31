package com.uniops.demo.config;

import com.uniops.demo.model.Facility;
import com.uniops.demo.model.FacilityType;
import com.uniops.demo.model.User;
import com.uniops.demo.model.UserRole;
import com.uniops.demo.repository.FacilityRepository;
import com.uniops.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .password("admin123")
                    .email("admin@university.edu")
                    .fullName("System Administrator")
                    .role(UserRole.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);

            User faculty = User.builder()
                    .username("faculty1")
                    .password("faculty123")
                    .email("faculty@university.edu")
                    .fullName("Dr. John Smith")
                    .role(UserRole.FACULTY)
                    .active(true)
                    .build();
            userRepository.save(faculty);

            User student = User.builder()
                    .username("student1")
                    .password("student123")
                    .email("student@university.edu")
                    .fullName("Jane Doe")
                    .role(UserRole.STUDENT)
                    .active(true)
                    .build();
            userRepository.save(student);
        }

        // Create sample facilities
        if (facilityRepository.count() == 0) {
            Facility auditorium = Facility.builder()
                    .name("Main Auditorium")
                    .description("Large auditorium for conferences and events")
                    .location("Building A, Floor 1")
                    .capacity(500)
                    .type(FacilityType.AUDITORIUM)
                    .available(true)
                    .build();
            facilityRepository.save(auditorium);

            Facility classroom = Facility.builder()
                    .name("Lecture Hall 101")
                    .description("Standard lecture hall")
                    .location("Building B, Floor 2")
                    .capacity(100)
                    .type(FacilityType.CLASSROOM)
                    .available(true)
                    .build();
            facilityRepository.save(classroom);

            Facility lab = Facility.builder()
                    .name("Computer Lab A")
                    .description("Computer laboratory with workstations")
                    .location("Building C, Floor 3")
                    .capacity(30)
                    .type(FacilityType.LABORATORY)
                    .available(true)
                    .build();
            facilityRepository.save(lab);

            Facility gym = Facility.builder()
                    .name("University Gym")
                    .description("Sports and fitness facility")
                    .location("Building D, Ground Floor")
                    .capacity(200)
                    .type(FacilityType.GYM)
                    .available(true)
                    .build();
            facilityRepository.save(gym);
        }
    }
}