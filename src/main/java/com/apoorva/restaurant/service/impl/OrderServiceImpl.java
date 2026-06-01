package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.dto.OrderItemRequest;
import com.apoorva.restaurant.dto.OrderItemResponse;
import com.apoorva.restaurant.dto.OrderRequest;
import com.apoorva.restaurant.dto.OrderResponse;
import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.entity.Order;
import com.apoorva.restaurant.entity.OrderItem;
import com.apoorva.restaurant.entity.User;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.repository.OrderRepository;
import com.apoorva.restaurant.repository.UserRepository;
import com.apoorva.restaurant.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("null")
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository, MenuItemRepository menuItemRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(Long userId, OrderRequest orderRequest) {
        Order order = new Order();
        // Use default user ID (1) for unauthenticated users to avoid null constraint
        order.setUserId(userId != null ? userId : 1L);
        // Set customer name: use user's email if authenticated, otherwise use request customer name
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                order.setCustomerName(user.getEmail());
            } else {
                order.setCustomerName(orderRequest.getCustomerName());
            }
        } else {
            order.setCustomerName(orderRequest.getCustomerName());
        }
        order.setStatus(Order.OrderStatus.PENDING);

        double totalAmount = 0.0;

        for (OrderItemRequest itemReq : orderRequest.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + itemReq.getMenuItemId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(menuItem.getPrice());

            order.addOrderItem(orderItem);
            totalAmount += menuItem.getPrice() * itemReq.getQuantity();
        }

        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return convertToResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Order> orders;
        if (userId != null) {
            orders = orderRepository.findByUserId(userId);
        } else {
            // For unauthenticated users, return empty list or all orders
            orders = orderRepository.findAll(); // or return new ArrayList<>();
        }
        return orders.stream().map(this::convertToResponse).toList();
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::convertToResponse).toList();
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + status);
        }
        Order savedOrder = orderRepository.save(order);
        return convertToResponse(savedOrder);
    }

    @Override
    @Transactional
    public void softDeleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setDeleted(true);
        orderRepository.save(order);
    }

    private OrderResponse convertToResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getMenuItem().getId(),
                        item.getMenuItem().getItemName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getCustomerName(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderTime(),
                items
        );
    }
}