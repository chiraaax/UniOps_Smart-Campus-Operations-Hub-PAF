package com.sliit.smartcampus.modules.user.service;

import com.sliit.smartcampus.common.enums.Role;
import com.sliit.smartcampus.modules.user.model.User;
import com.sliit.smartcampus.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Let Spring Security fetch the user details from Google first
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract the data Google sent us
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String pictureUrl = oAuth2User.getAttribute("picture");

        // Check if this user already exists in our MongoDB database
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            // If they don't exist, create a new User and give them the USER role
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPictureUrl(pictureUrl);
            newUser.setRole(Role.USER); // Default role as required by the assignment
            
            userRepository.save(newUser);
            System.out.println("New user registered: " + email);
        } else {
            System.out.println("Existing user logged in: " + email);
        }

        return oAuth2User;
    }
}