package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.dto.OrderRequest;
import com.apoorva.restaurant.dto.OrderResponse;
import com.apoorva.restaurant.security.JwtUtil;
import com.apoorva.restaurant.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    public OrderController(OrderService orderService, JwtUtil jwtUtil) {
        this.orderService = orderService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest orderRequest) {
        Long userId = getCurrentUserId();
        OrderResponse response = orderService.placeOrder(userId, orderRequest);
        return ResponseEntity.ok(response);
    }

    private Long getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            // For now return hardcoded userId 1 - fix User entity later to store userId
            return 1L; 
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserIdFromHeader(authHeader);
        List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    private Long extractUserIdFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid or missing Authorization header");
        }

        String token = authHeader.substring(7);
        return jwtUtil.extractUserId(token);
    }
}