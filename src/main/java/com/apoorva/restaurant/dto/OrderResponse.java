package com.apoorva.restaurant.dto;

import com.apoorva.restaurant.entity.Order;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private String customerName;
    private Double totalAmount;
    private Order.OrderStatus status;
    private LocalDateTime orderTime;
    private List<OrderItemResponse> items;

    public OrderResponse(Long orderId, Long userId, String customerName, Double totalAmount, Order.OrderStatus status, LocalDateTime orderTime, List<OrderItemResponse> items) {
        this.orderId = orderId;
        this.userId = userId;
        this.customerName = customerName;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderTime = orderTime;
        this.items = items;
    }
}
