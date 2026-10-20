package com.erp.backend.service;

import com.erp.backend.model.User;
import com.erp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        if (user.getStatus() != null && !"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User is inactive");
        }

        return user.getRole() == null ? "" : user.getRole().trim().toLowerCase();
    }
}