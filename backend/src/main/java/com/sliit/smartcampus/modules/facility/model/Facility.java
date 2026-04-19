package com.sliit.smartcampus.modules.facility.model;

import com.sliit.smartcampus.common.enums.FacilityStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data // Lombok automatically creates your Getters and Setters!
@Document(collection = "facilities") // Tells Spring to save this in the 'facilities' MongoDB collection
public class Facility {

    @Id
    private String id;

    private String name;        
    private String type;        // e.g., "Lecture Hall", "Lab", "Meeting Room", "Equipment"
    private int capacity;       
    private String location;    
    
    // --- Advanced Fields matching your React UI ---
    private List<String> features;     // e.g., ["Projector", "Whiteboard"]
    private String imageUrl;           // Path to the image in your frontend public folder
    private String openTime;           // e.g., "08:00 AM" 
    private String closeTime;          // e.g., "06:00 PM" 
    
    private FacilityStatus status; 
}