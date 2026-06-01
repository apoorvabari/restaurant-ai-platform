package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.dto.ReservationResponse;
import com.apoorva.restaurant.service.ReservationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Legacy controller to handle old /api/reservations endpoint
 * Redirects to admin endpoints for backward compatibility
 */
@RestController
@RequestMapping("/api/reservations")
public class LegacyReservationsController {

    private final ReservationService reservationService;

    public LegacyReservationsController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // GET /api/reservations - Redirect to admin endpoint
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReservationResponse> reservations = reservationService.getAllReservations(pageable);
        return ResponseEntity.ok(reservations.getContent());
    }

    // DELETE /api/reservations/{id} - Redirect to admin endpoint
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.softDeleteReservation(id);
        return ResponseEntity.ok().build();
    }

    // POST /api/reservations/expire - Redirect to admin endpoint
    @PostMapping("/expire")
    public ResponseEntity<Integer> expireOldReservations() {
        int expiredCount = reservationService.expireOldReservations();
        return ResponseEntity.ok(expiredCount);
    }
}
