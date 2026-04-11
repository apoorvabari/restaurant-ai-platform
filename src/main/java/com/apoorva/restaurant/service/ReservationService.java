package com.apoorva.restaurant.service;

import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.dto.ReservationResponse;

import java.util.List;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequest request, String email);
    List<ReservationResponse> getReservationsByUser(String email);
    ReservationResponse getReservationById(Long id, String email);
    void cancelReservation(Long id, String email);
}