package com.apoorva.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String customerName;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private Integer numberOfGuests;
    
    @Column(nullable = false)
    private String reservationDate;
    
    @Column(nullable = false)
    private String reservationTime;
    
    private String specialRequest;
    
    @Column(nullable = false)
    private String userEmail;
    
    @Column(nullable = false)
    private String status = "CONFIRMED";
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}