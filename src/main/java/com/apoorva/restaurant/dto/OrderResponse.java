package com.apoorva.restaurant.dto;

import com.apoorva.restaurant.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;
    private Long userId;
    private Double totalAmount;
    private Order.OrderStatus status;
    private LocalDateTime orderTime;
    private List<OrderItemResponse> items;
}