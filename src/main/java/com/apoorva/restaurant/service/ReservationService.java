package com.apoorva.restaurant.service;

import com.apoorva.restaurant.dto.PublicReservationResponse;
import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.dto.ReservationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequest request);
    List<ReservationResponse> getAllReservations();
    Page<ReservationResponse> getAllReservations(Pageable pageable);
    void softDeleteReservation(Long reservationId);
    Page<ReservationResponse> getUserReservations(String userId, Pageable pageable);
    Page<PublicReservationResponse> getPublicUserReservations(String userId, Pageable pageable);
    void deleteUserReservation(Long reservationId, String userId);
    int expireOldReservations();
}