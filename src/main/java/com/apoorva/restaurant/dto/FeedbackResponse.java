package com.apoorva.restaurant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class FeedbackResponse {
    private Long id;
    private String customerName;
    private String email;
    private Integer rating;
    private String comment;
    private String orderId;
    private Long reservationId;
    private LocalDateTime createdAt;

    public FeedbackResponse(Long id, String customerName, String email, Integer rating, String comment, String orderId, Long reservationId, LocalDateTime createdAt) {
        this.id = id;
        this.customerName = customerName;
        this.email = email;
        this.rating = rating;
        this.comment = comment;
        this.orderId = orderId;
        this.reservationId = reservationId;
        this.createdAt = createdAt;
    }
}
