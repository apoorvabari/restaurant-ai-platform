package com.apoorva.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservations")
@SQLRestriction("deleted = false")
@Data
@NoArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String phoneNumber;
    private Integer numberOfGuests;
    private LocalDate reservationDate;
    private LocalTime reservationTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    private Long tableId;
    private Integer durationHours;
    private String specialRequest;
    private String userId;

    private boolean deleted = false;

    public enum ReservationStatus {
        BOOKED,
        CONFIRMED,
        ON_GOING,
        CANCELLED,
        COMPLETED,
        EXPIRED,
        NO_SHOW
    }

    public Reservation(String customerName, String phoneNumber, Integer numberOfGuests, LocalDate reservationDate, LocalTime reservationTime, ReservationStatus status) {
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.numberOfGuests = numberOfGuests;
        this.reservationDate = reservationDate;
        this.reservationTime = reservationTime;
        this.status = status;
    }
}