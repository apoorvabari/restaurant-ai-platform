package com.apoorva.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {
    private String customerName;
    private String phoneNumber;
    private Integer numberOfGuests;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
}