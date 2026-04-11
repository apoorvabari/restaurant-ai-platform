package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.dto.AuthRequest;
import com.apoorva.restaurant.dto.AuthResponse;
import com.apoorva.restaurant.entity.User;
import com.apoorva.restaurant.security.JwtUtil;
import com.apoorva.restaurant.service.TokenBlacklistService;
import com.apoorva.restaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        User user = userService.registerUser(request);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getRole(), user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userService.findByEmail(request.getEmail());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getRole(), user.getId()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader,
                                    Authentication authentication) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "error", "message", "Missing or invalid Authorization header"));
            }

            String token = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(token);

            String username = authentication != null ? authentication.getName() : "Unknown user";

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Logged out successfully",
                    "user", username
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Logout failed: " + e.getMessage()));
        }
    }
}