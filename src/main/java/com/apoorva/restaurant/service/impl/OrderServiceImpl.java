package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.dto.OrderItemRequest;
import com.apoorva.restaurant.dto.OrderItemResponse;
import com.apoorva.restaurant.dto.OrderRequest;
import com.apoorva.restaurant.dto.OrderResponse;
import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.entity.Order;
import com.apoorva.restaurant.entity.OrderItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.repository.OrderRepository;
import com.apoorva.restaurant.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;

    public OrderServiceImpl(OrderRepository orderRepository, MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(Long userId, OrderRequest orderRequest) {
        Order order = new Order();
        order.setUserId(userId);
        order.setStatus(Order.OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemRequest itemReq : orderRequest.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + itemReq.getMenuItemId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setPrice(menuItem.getPrice());

            orderItems.add(orderItem);
            totalAmount += menuItem.getPrice() * itemReq.getQuantity();
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return convertToResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(this::convertToResponse).toList();
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToResponse(order);
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
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderTime(),
                items
        );
    }
}