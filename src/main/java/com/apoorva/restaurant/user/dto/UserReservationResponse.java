package com.apoorva.restaurant.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
public class UserReservationResponse {
    private Long id;
    private String customerName;
    private Integer numberOfGuests;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private String status;
    private Integer tableNumber;
    private Integer durationHours;
}
