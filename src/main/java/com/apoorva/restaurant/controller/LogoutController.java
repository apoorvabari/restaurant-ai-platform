package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LogoutController {

    private final JwtUtil jwtUtil;
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestHeader("Authorization") String authHeader,
            Authentication authentication) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid token"));
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token is invalid"));
        }

        blacklistedTokens.add(token);

        return ResponseEntity.ok(Map.of(
                "message", "Logout successful",
                "user", authentication != null ? authentication.getName() : "Unknown"
        ));
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}