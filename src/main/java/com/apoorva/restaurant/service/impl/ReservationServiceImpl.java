package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.dto.ReservationResponse;
import com.apoorva.restaurant.entity.Reservation;
import com.apoorva.restaurant.repository.ReservationRepository;
import com.apoorva.restaurant.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    @Override
    public ReservationResponse createReservation(ReservationRequest request, String email) {
        Reservation reservation = new Reservation();
        reservation.setCustomerName(request.getCustomerName());
        reservation.setPhone(request.getPhone());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setReservationDate(request.getReservationDate());
        reservation.setReservationTime(request.getReservationTime());
        reservation.setSpecialRequest(request.getSpecialRequest());
        reservation.setUserEmail(email);
        
        Reservation saved = reservationRepository.save(reservation);
        
        return ReservationResponse.builder()
            .id(saved.getId())
            .customerName(saved.getCustomerName())
            .phone(saved.getPhone())
            .numberOfGuests(saved.getNumberOfGuests())
            .reservationDate(saved.getReservationDate())
            .reservationTime(saved.getReservationTime())
            .specialRequest(saved.getSpecialRequest())
            .status(saved.getStatus())
            .userEmail(saved.getUserEmail())
            .build();
    }

    @Override
    public List<ReservationResponse> getReservationsByUser(String email) {
        return reservationRepository.findByUserEmail(email)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public ReservationResponse getReservationById(Long id, String email) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        if (!reservation.getUserEmail().equals(email)) {
            throw new RuntimeException("Not authorized to access this reservation");
        }
        
        return toResponse(reservation);
    }

    @Override
    public void cancelReservation(Long id, String email) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        if (!reservation.getUserEmail().equals(email)) {
            throw new RuntimeException("Not authorized to cancel this reservation");
        }
        
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
    }
    
    private ReservationResponse toResponse(Reservation reservation) {
        return ReservationResponse.builder()
            .id(reservation.getId())
            .customerName(reservation.getCustomerName())
            .phone(reservation.getPhone())
            .numberOfGuests(reservation.getNumberOfGuests())
            .reservationDate(reservation.getReservationDate())
            .reservationTime(reservation.getReservationTime())
            .specialRequest(reservation.getSpecialRequest())
            .status(reservation.getStatus())
            .userEmail(reservation.getUserEmail())
            .build();
    }
}