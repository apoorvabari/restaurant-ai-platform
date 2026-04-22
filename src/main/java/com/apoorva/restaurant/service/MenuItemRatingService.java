package com.apoorva.restaurant.service;

import com.apoorva.restaurant.dto.MenuItemRatingRequest;
import com.apoorva.restaurant.dto.TopRatedMenuItemResponse;

import java.util.List;

public interface MenuItemRatingService {
    void submitRating(MenuItemRatingRequest request);
    List<TopRatedMenuItemResponse> getTop5RatedMenuItems();
    Double getAverageRatingForMenuItem(Long menuItemId);
    Long getTotalRatingsForMenuItem(Long menuItemId);
}
