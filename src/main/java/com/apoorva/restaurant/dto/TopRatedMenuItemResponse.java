package com.apoorva.restaurant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
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

    public TopRatedMenuItemResponse(Long menuItemId, String name, String code, String description, Double price, String category, String imageUrl, BigDecimal averageRating, Long totalRatings) {
        this.menuItemId = menuItemId;
        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
    }
}
