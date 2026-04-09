package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.dto.ReservationResponse;
import com.apoorva.restaurant.entity.Reservation;
import com.apoorva.restaurant.repository.ReservationRepository;
import com.apoorva.restaurant.service.ReservationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public ReservationResponse createReservation(ReservationRequest request) {
        Reservation reservation = new Reservation();
        reservation.setCustomerName(request.getCustomerName());
        reservation.setPhoneNumber(request.getPhoneNumber());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setReservationDate(request.getReservationDate());
        reservation.setReservationTime(request.getReservationTime());
        reservation.setStatus("BOOKED");

        Reservation saved = reservationRepository.save(reservation);

        return new ReservationResponse(
                saved.getId(),
                saved.getCustomerName(),
                saved.getPhoneNumber(),
                saved.getNumberOfGuests(),
                saved.getReservationDate(),
                saved.getReservationTime(),
                saved.getStatus()
        );
    }

    @Override
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(r -> new ReservationResponse(
                        r.getId(),
                        r.getCustomerName(),
                        r.getPhoneNumber(),
                        r.getNumberOfGuests(),
                        r.getReservationDate(),
                        r.getReservationTime(),
                        r.getStatus()
                ))
                .toList();
    }
}