package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request,
                                               Authentication authentication) {
        try {
            String email = authentication.getName();
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.createReservation(request, email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyReservations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reservationService.getReservationsByUser(email));
    }
}