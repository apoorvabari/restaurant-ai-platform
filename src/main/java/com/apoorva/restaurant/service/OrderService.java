package com.apoorva.restaurant.service;

import com.apoorva.restaurant.dto.OrderRequest;
import com.apoorva.restaurant.dto.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(Long userId, OrderRequest orderRequest);
    List<OrderResponse> getOrdersByUserId(Long userId);
    OrderResponse getOrderById(Long orderId);
}