package com.apoorva.restaurant.user.controller;

import com.apoorva.restaurant.dto.PublicReservationResponse;
import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.dto.ReservationResponse;
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

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request) {
        try {
            return ResponseEntity.ok(reservationService.createReservation(request));
        } catch (Exception e) {
            logger.error("Error creating reservation", e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<PublicReservationResponse>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "reservationDate") String sortBy,
            Authentication authentication
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
            String userId = authentication.getName();
            Page<PublicReservationResponse> reservations = reservationService.getPublicUserReservations(userId, pageable);
            return ResponseEntity.ok(reservations.getContent());
        } catch (Exception e) {
            logger.error("Error fetching user reservations", e);
            throw e;
        }
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> softDeleteReservation(@PathVariable Long reservationId, Authentication authentication) {
        try {
            String userId = authentication.getName();
            reservationService.deleteUserReservation(reservationId, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting reservation with id: {}", reservationId, e);
            throw e;
        }
    }
}
