package com.apoorva.restaurant.user.controller;

import com.apoorva.restaurant.dto.OrderRequest;
import com.apoorva.restaurant.dto.OrderResponse;
import com.apoorva.restaurant.entity.User;
import com.apoorva.restaurant.service.KeycloakUserSyncService;
import com.apoorva.restaurant.service.OrderService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Order Controller — Keycloak OAuth2 authenticated.
 *
 * Uses {@link KeycloakUserSyncService} to resolve (and auto-provision) the
 * local MySQL user from the Keycloak JWT on every request, eliminating
 * the "User not found" error for first-time Keycloak users.
 */
@RestController
@RequestMapping("/api/v1/user/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final KeycloakUserSyncService keycloakUserSyncService;

    public OrderController(OrderService orderService,
                           KeycloakUserSyncService keycloakUserSyncService) {
        this.orderService = orderService;
        this.keycloakUserSyncService = keycloakUserSyncService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody OrderRequest orderRequest,
            Authentication authentication) {
        try {
            logger.info("Received order request with {} items",
                    orderRequest.getItems() != null ? orderRequest.getItems().size() : 0);

            User user = keycloakUserSyncService.getOrCreateUser(authentication);
            logger.info("Placing order for user: {} (id={})", user.getEmail(), user.getId());

            OrderResponse response = orderService.placeOrder(user.getId(), orderRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error placing order", e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        try {
            User user = keycloakUserSyncService.getOrCreateUser(authentication);
            logger.info("Fetching orders for user: {} (id={})", user.getEmail(), user.getId());

            List<OrderResponse> orders = orderService.getOrdersByUserId(user.getId());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error fetching user orders", e);
            throw e;
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {
        try {
            User user = keycloakUserSyncService.getOrCreateUser(authentication);
            OrderResponse order = orderService.getOrderById(orderId);

            if (!user.getId().equals(order.getUserId())) {
                throw new RuntimeException("You can only view your own orders");
            }

            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.error("Error fetching order {}", orderId, e);
            throw e;
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> softDeleteOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        try {
            User user = keycloakUserSyncService.getOrCreateUser(authentication);
            OrderResponse order = orderService.getOrderById(orderId);

            if (!user.getId().equals(order.getUserId())) {
                throw new RuntimeException("You can only delete your own orders");
            }

            orderService.softDeleteOrder(orderId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting order {}", orderId, e);
            throw e;
        }
    }
}
