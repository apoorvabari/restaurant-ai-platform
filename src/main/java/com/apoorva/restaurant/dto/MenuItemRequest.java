package com.apoorva.restaurant.dto;

import lombok.Data;

@Data
public class MenuItemRequest {
    private String itemCode;
    private String itemName;
    private String description;
    private String category;
    private Double price;
    private String imageUrl;
    private Boolean available;
}