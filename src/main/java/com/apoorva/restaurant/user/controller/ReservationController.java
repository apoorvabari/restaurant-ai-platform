package com.apoorva.restaurant.user.controller;

import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.dto.ReservationResponse;
import com.apoorva.restaurant.entity.User;
import com.apoorva.restaurant.repository.UserRepository;
import com.apoorva.restaurant.service.ReservationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/reservations")
public class ReservationController {

    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);
    private final ReservationService reservationService;
    private final UserRepository userRepository;

    public ReservationController(ReservationService reservationService, UserRepository userRepository) {
        this.reservationService = reservationService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request, Authentication authentication) {
        try {
            Long userId = authentication != null ? extractUserId(authentication) : null;
            return ResponseEntity.ok(reservationService.createReservation(request, userId));
        } catch (Exception e) {
            logger.error("Error creating reservation", e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "reservationDate") String sortBy,
            Authentication authentication
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
            Long userId = extractUserId(authentication);
            Page<ReservationResponse> reservations;
            if (userId != null) {
                reservations = reservationService.getUserReservations(userId.toString(), pageable);
            } else {
                // For unauthenticated users, return all reservations
                reservations = reservationService.getAllReservations(pageable);
            }
            return ResponseEntity.ok(reservations.getContent());
        } catch (Exception e) {
            logger.error("Error fetching user reservations", e);
            throw e;
        }
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> softDeleteReservation(@PathVariable Long reservationId, Authentication authentication) {
        try {
            Long userId = extractUserId(authentication);
            if (userId != null) {
                reservationService.deleteUserReservation(reservationId, userId.toString());
            } else {
                // For unauthenticated users, allow deletion without user validation
                reservationService.softDeleteReservation(reservationId);
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting reservation with id: {}", reservationId, e);
            throw e;
        }
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null; // Return null for unauthenticated users
        }

        String username = authentication.getName();
        if (username == null || username.isEmpty() || "anonymousUser".equals(username)) {
            return null; // Return null for anonymous users
        }

        try {
            return Long.parseLong(username);
        } catch (NumberFormatException e) {
            logger.warn("Username is not a numeric ID, looking up by email: {}", username);
            User user = userRepository.findByEmail(username)
                    .orElse(null); // Return null if user not found
            return user != null ? user.getId() : null;
        }
    }
}
