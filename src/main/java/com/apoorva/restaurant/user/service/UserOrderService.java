package com.apoorva.restaurant.user.service;

import com.apoorva.restaurant.dto.OrderRequest;
import com.apoorva.restaurant.dto.OrderResponse;
import com.apoorva.restaurant.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserOrderService {

    private final OrderService orderService;

    public UserOrderService(OrderService orderService) {
        this.orderService = orderService;
    }

    public OrderResponse placeOrder(Long userId, OrderRequest orderRequest) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (orderRequest == null) {
            throw new IllegalArgumentException("Order request cannot be null");
        }
        return orderService.placeOrder(userId, orderRequest);
    }

    public List<OrderResponse> getMyOrders(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return orderService.getOrdersByUserId(userId);
    }

    public OrderResponse getOrderById(Long orderId, Long userId) {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        OrderResponse order = orderService.getOrderById(orderId);
        
        // Verify user owns the order
        if (!userId.equals(order.getUserId())) {
            throw new RuntimeException("You can only view your own orders");
        }
        
        return order;
    }

    public void deleteOrder(Long orderId, Long userId) {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        OrderResponse order = orderService.getOrderById(orderId);
        
        // Verify user owns the order
        if (!userId.equals(order.getUserId())) {
            throw new RuntimeException("You can only delete your own orders");
        }
        
        orderService.softDeleteOrder(orderId);
    }
}
