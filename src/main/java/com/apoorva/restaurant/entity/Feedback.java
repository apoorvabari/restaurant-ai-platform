package com.apoorva.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@SQLRestriction("deleted = false")
@Data
@NoArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String email;
    private Integer rating; // 1-5 stars
    private String comment;
    private String orderId; // Optional: link to order
    private Long reservationId; // Optional: link to reservation
    private LocalDateTime createdAt;
    private boolean deleted = false;

    public Feedback(String customerName, String email, Integer rating, String comment) {
        this.customerName = customerName;
        this.email = email;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    public Feedback(String customerName, String email, Integer rating, String comment, String orderId, Long reservationId) {
        this.customerName = customerName;
        this.email = email;
        this.rating = rating;
        this.comment = comment;
        this.orderId = orderId;
        this.reservationId = reservationId;
        this.createdAt = LocalDateTime.now();
    }
}
