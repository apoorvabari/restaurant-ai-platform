package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.entity.User;
import com.apoorva.restaurant.repository.UserRepository;
import com.apoorva.restaurant.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}