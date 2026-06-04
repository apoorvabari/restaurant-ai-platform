package com.apoorva.restaurant.service;

import com.apoorva.restaurant.entity.User;

public interface UserService {

    User findByEmail(String email);
}