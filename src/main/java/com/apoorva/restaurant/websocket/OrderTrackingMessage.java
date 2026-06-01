package com.apoorva.restaurant.websocket;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderTrackingMessage {
    private Long orderId;
    private String status;
    private String message;

    public OrderTrackingMessage(Long orderId, String status, String message) {
        this.orderId = orderId;
        this.status = status;
        this.message = message;
    }
}
