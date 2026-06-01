package com.apoorva.restaurant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderItemResponse {
    private Long menuItemId;
    private String itemName;
    private Integer quantity;
    private Double price;

    public OrderItemResponse(Long menuItemId, String itemName, Integer quantity, Double price) {
        this.menuItemId = menuItemId;
        this.itemName = itemName;
        this.quantity = quantity;
        this.price = price;
    }
}
