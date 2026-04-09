package com.apoorva.restaurant.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderTrackingMessage {
    private Long orderId;
    private String status;
    private String message;
}