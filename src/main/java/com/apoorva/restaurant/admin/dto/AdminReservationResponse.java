package com.apoorva.restaurant.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
public class AdminReservationResponse {
    private Long id;
    private Long userId;
    private String customerName;
    private String phoneNumber;
    private Integer numberOfGuests;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private String status;
    private Long tableId;
    private Integer tableNumber;
    private Integer durationHours;
    private String specialRequest;
    private String userEmail;
}
