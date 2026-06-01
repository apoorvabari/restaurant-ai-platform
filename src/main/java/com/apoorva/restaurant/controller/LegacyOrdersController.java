package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.dto.OrderResponse;
import com.apoorva.restaurant.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Legacy controller to handle old /api/orders endpoint
 * Redirects to admin endpoints for backward compatibility
 */
@RestController
@RequestMapping("/api/orders")
public class LegacyOrdersController {

    private final OrderService orderService;

    public LegacyOrdersController(OrderService orderService) {
        this.orderService = orderService;
    }

    // GET /api/orders - Redirect to admin endpoint
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // PUT /api/orders/{id}/status - Redirect to admin endpoint
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // DELETE /api/orders/{id} - Redirect to admin endpoint
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.softDeleteOrder(id);
        return ResponseEntity.ok().build();
    }
}
