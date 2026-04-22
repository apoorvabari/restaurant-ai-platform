package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.config.JwtUtil;
import com.apoorva.restaurant.dto.AuthRequest;
import com.apoorva.restaurant.dto.AuthResponse;
import com.apoorva.restaurant.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        try {
            com.apoorva.restaurant.entity.User user = userService.registerUser(request);
            AuthResponse response = new AuthResponse(null, user.getEmail(), user.getRole(), user.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            AuthResponse errorResponse = new AuthResponse(e.getMessage(), null, null, null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            com.apoorva.restaurant.entity.User user = userService.findByEmail(request.getEmail());
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
            AuthResponse response = new AuthResponse(token, user.getEmail(), user.getRole(), user.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse errorResponse = new AuthResponse("Invalid credentials", null, null, null);
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}
