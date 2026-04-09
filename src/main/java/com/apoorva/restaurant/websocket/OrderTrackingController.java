package com.apoorva.restaurant.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class OrderTrackingController {

    @MessageMapping("/order/update")
    @SendTo("/topic/orders")
    public OrderTrackingMessage sendOrderUpdate(OrderTrackingMessage message) {
        return message;
    }
}