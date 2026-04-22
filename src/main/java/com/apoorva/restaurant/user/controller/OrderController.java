package com.apoorva.restaurant.user.controller;

import com.apoorva.restaurant.dto.OrderRequest;
import com.apoorva.restaurant.dto.OrderResponse;
import com.apoorva.restaurant.entity.User;
import com.apoorva.restaurant.repository.UserRepository;
import com.apoorva.restaurant.service.OrderService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest orderRequest, Authentication authentication) {
        try {
            logger.info("Received order request with items count: {}", orderRequest.getItems() != null ? orderRequest.getItems().size() : 0);
            if (orderRequest.getItems() != null) {
                orderRequest.getItems().forEach(item -> 
                    logger.info("Item - menuItemId: {}, quantity: {}", item.getMenuItemId(), item.getQuantity()));
            }
            
            Long userId = extractUserId(authentication);
            logger.info("Extracted userId: {}", userId);
            
            OrderResponse response = orderService.placeOrder(userId, orderRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error placing order. Request: {}, Auth: {}", orderRequest, authentication, e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        try {
            Long userId = extractUserId(authentication);
            List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error fetching user orders", e);
            throw e;
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId, Authentication authentication) {
        try {
            Long userId = extractUserId(authentication);
            OrderResponse order = orderService.getOrderById(orderId);
            
            // Verify user owns the order
            if (!userId.equals(order.getUserId())) {
                throw new RuntimeException("You can only view your own orders");
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.error("Error fetching order with id: {}", orderId, e);
            throw e;
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> softDeleteOrder(@PathVariable Long orderId, Authentication authentication) {
        try {
            Long userId = extractUserId(authentication);
            OrderResponse order = orderService.getOrderById(orderId);
            
            // Verify user owns the order
            if (!userId.equals(order.getUserId())) {
                throw new RuntimeException("You can only delete your own orders");
            }
            
            orderService.softDeleteOrder(orderId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting order with id: {}", orderId, e);
            throw e;
        }
    }

    private Long extractUserId(Authentication authentication) {
        try {
            if (authentication == null) {
                throw new RuntimeException("User not authenticated");
            }

            // For local authentication, use the username (email) as the user identifier
            String username = authentication.getName();
            if (username != null && !username.isEmpty()) {
                try {
                    // Try to parse as Long ID
                    return Long.parseLong(username);
                } catch (NumberFormatException e) {
                    // If username is an email, look up the user ID
                    logger.warn("Username is not a numeric ID, looking up by email: {}", username);
                    User user = userRepository.findByEmail(username)
                            .orElseThrow(() -> new RuntimeException("User not found with email: " + username));
                    return user.getId();
                }
            }

            throw new RuntimeException("No username found in authentication");
        } catch (Exception e) {
            logger.error("Error extracting user ID from authentication", e);
            throw new RuntimeException("Failed to extract user ID", e);
        }
    }
}
