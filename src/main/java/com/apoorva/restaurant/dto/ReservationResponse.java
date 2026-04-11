package com.apoorva.restaurant.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private String customerName;
    private String phone;
    private Integer numberOfGuests;
    private String reservationDate;
    private String reservationTime;
    private String specialRequest;
    private String status;
    private String userEmail;
}