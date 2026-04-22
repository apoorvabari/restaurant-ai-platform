package com.apoorva.restaurant.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UserOrderResponse {
    private Long orderId;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private Integer estimatedDeliveryMinutes;
}
