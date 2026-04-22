package com.apoorva.restaurant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
public class ReservationResponse {
    private Long id;
    private String customerName;
    private String phoneNumber;
    private Integer numberOfGuests;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private String status;
    private Long tableId;
    private Integer tableNumber;
    private Integer durationHours;

    public ReservationResponse(Long id, String customerName, String phoneNumber, Integer numberOfGuests, LocalDate reservationDate, LocalTime reservationTime, String status) {
        this.id = id;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.numberOfGuests = numberOfGuests;
        this.reservationDate = reservationDate;
        this.reservationTime = reservationTime;
        this.status = status;
    }

    public ReservationResponse(Long id, String customerName, String phoneNumber, Integer numberOfGuests, LocalDate reservationDate, LocalTime reservationTime, String status, Long tableId, Integer tableNumber, Integer durationHours) {
        this.id = id;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.numberOfGuests = numberOfGuests;
        this.reservationDate = reservationDate;
        this.reservationTime = reservationTime;
        this.status = status;
        this.tableId = tableId;
        this.tableNumber = tableNumber;
        this.durationHours = durationHours;
    }
}