package com.apoorva.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FeedbackResponse {
    private Long id;
    private String customerName;
    private String email;
    private Integer rating;
    private String comment;
    private String orderId;
    private Long reservationId;
    private LocalDateTime createdAt;
}
