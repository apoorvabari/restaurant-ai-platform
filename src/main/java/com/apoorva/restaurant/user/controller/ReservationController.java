package com.apoorva.restaurant.user.controller;

import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.dto.ReservationResponse;
import com.apoorva.restaurant.entity.User;
import com.apoorva.restaurant.service.KeycloakUserSyncService;
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

/**
 * Reservation Controller — Keycloak OAuth2 authenticated.
 *
 * User identity is resolved via {@link KeycloakUserSyncService} which
 * auto-provisions a MySQL row in `users` on first login and keeps it
 * in sync with the Keycloak JWT claims on every subsequent request.
 */
@RestController
@RequestMapping("/api/v1/user/reservations")
public class ReservationController {

    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    private final ReservationService reservationService;
    private final KeycloakUserSyncService keycloakUserSyncService;

    public ReservationController(ReservationService reservationService,
                                 KeycloakUserSyncService keycloakUserSyncService) {
        this.reservationService = reservationService;
        this.keycloakUserSyncService = keycloakUserSyncService;
    }

    // -------------------------------------------------------------------------
    // POST /api/v1/user/reservations
    // -------------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication) {
        try {
            Long userId = null;

            if (authentication != null && authentication.isAuthenticated()) {
                // Auto-provision user in MySQL on first login, then get their id
                User user = keycloakUserSyncService.getOrCreateUser(authentication);
                userId = user.getId();
                logger.info("Creating reservation for user: {} (id={})", user.getEmail(), userId);
            } else {
                logger.info("Creating reservation for unauthenticated user");
            }

            return ResponseEntity.ok(reservationService.createReservation(request, userId));
        } catch (Exception e) {
            logger.error("Error creating reservation", e);
            throw e;
        }
    }

    // -------------------------------------------------------------------------
    // GET /api/v1/user/reservations
    // -------------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "reservationDate") String sortBy,
            Authentication authentication) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
            Page<ReservationResponse> reservations;

            if (authentication != null && authentication.isAuthenticated()) {
                // Auto-provision / sync user, then return only their reservations
                User user = keycloakUserSyncService.getOrCreateUser(authentication);
                logger.info("Fetching reservations for user: {} (id={})", user.getEmail(), user.getId());
                reservations = reservationService.getUserReservations(user.getId().toString(), pageable);
            } else {
                logger.info("Fetching all reservations for unauthenticated request");
                reservations = reservationService.getAllReservations(pageable);
            }

            return ResponseEntity.ok(reservations.getContent());
        } catch (Exception e) {
            logger.error("Error fetching reservations", e);
            throw e;
        }
    }

    // -------------------------------------------------------------------------
    // DELETE /api/v1/user/reservations/{reservationId}
    // -------------------------------------------------------------------------
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> softDeleteReservation(
            @PathVariable Long reservationId,
            Authentication authentication) {
        try {
            if (authentication != null && authentication.isAuthenticated()) {
                User user = keycloakUserSyncService.getOrCreateUser(authentication);
                logger.info("Deleting reservation {} for user: {}", reservationId, user.getEmail());
                reservationService.deleteUserReservation(reservationId, user.getId().toString());
            } else {
                logger.info("Deleting reservation {} (unauthenticated)", reservationId);
                reservationService.softDeleteReservation(reservationId);
            }

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting reservation {}", reservationId, e);
            throw e;
        }
    }
}
