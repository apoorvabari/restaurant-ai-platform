package com.apoorva.restaurant.service;

import com.apoorva.restaurant.dto.OrderRequest;
import com.apoorva.restaurant.dto.OrderResponse;
import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(Long userId, OrderRequest orderRequest);
    List<OrderResponse> getOrdersByUserId(Long userId);
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(Long orderId);
    OrderResponse updateOrderStatus(Long orderId, String status);
    void softDeleteOrder(Long orderId);
}