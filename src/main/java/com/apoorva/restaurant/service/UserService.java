package com.apoorva.restaurant.service;

import com.apoorva.restaurant.dto.AuthRequest;
import com.apoorva.restaurant.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    User registerUser(AuthRequest authRequest);
    
    User findByEmail(String email);
}