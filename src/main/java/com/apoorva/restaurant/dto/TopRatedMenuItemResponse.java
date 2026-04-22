package com.apoorva.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class TopRatedMenuItemResponse {
    private Long menuItemId;
    private String name;
    private String code;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private BigDecimal averageRating;
    private Long totalRatings;
}
