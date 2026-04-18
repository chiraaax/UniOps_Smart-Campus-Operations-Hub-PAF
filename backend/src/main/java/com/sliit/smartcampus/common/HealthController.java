package com.sliit.smartcampus.common;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

	@GetMapping("/api/health")
	public Map<String, String> getHealth() {
		return Map.of(
				"status", "OK",
				"message", "Backend is running"
		);
	}
}
