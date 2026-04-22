package com.apoorva.restaurant.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AdminOrderResponse {
    private Long orderId;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String deliveryAddress;
    private String phoneNumber;
}
