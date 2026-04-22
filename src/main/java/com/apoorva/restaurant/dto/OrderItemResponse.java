package com.apoorva.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long menuItemId;
    private String itemName;
    private Integer quantity;
    private Double price;
}