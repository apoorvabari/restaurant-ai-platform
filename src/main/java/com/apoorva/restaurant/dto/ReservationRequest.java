package com.apoorva.restaurant.dto;

import lombok.Data;

@Data
public class ReservationRequest {
    private String customerName;
    private String phone;
    private Integer numberOfGuests;
    private String reservationDate;
    private String reservationTime;
    private String specialRequest;
}