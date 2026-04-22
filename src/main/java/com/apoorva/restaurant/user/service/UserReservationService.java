package com.apoorva.restaurant.user.service;

import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.dto.ReservationResponse;
import com.apoorva.restaurant.service.ReservationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserReservationService {

    private final ReservationService reservationService;

    public UserReservationService(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    public ReservationResponse createReservation(ReservationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Reservation request cannot be null");
        }
        return reservationService.createReservation(request);
    }

    public List<ReservationResponse> getMyReservations(String userId, int page, int size, String sortBy) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<ReservationResponse> reservations = reservationService.getUserReservations(userId, pageable);
        return reservations.getContent();
    }

    public void deleteReservation(Long reservationId, String userId) {
        if (reservationId == null) {
            throw new IllegalArgumentException("Reservation ID cannot be null");
        }
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        reservationService.deleteUserReservation(reservationId, userId);
    }
}
