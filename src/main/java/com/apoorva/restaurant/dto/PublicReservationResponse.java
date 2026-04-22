package com.apoorva.restaurant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
public class PublicReservationResponse {
    private Long id;
    private Integer numberOfGuests;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private String status;
    private Long tableId;
    private Integer tableNumber;
    private Integer durationHours;

    public PublicReservationResponse(Long id, Integer numberOfGuests, LocalDate reservationDate, LocalTime reservationTime, String status, Long tableId, Integer tableNumber, Integer durationHours) {
        this.id = id;
        this.numberOfGuests = numberOfGuests;
        this.reservationDate = reservationDate;
        this.reservationTime = reservationTime;
        this.status = status;
        this.tableId = tableId;
        this.tableNumber = tableNumber;
        this.durationHours = durationHours;
    }
}
