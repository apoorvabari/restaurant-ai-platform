package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.dto.MenuItemRatingRequest;
import com.apoorva.restaurant.dto.TopRatedMenuItemResponse;
import com.apoorva.restaurant.service.MenuItemRatingService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu-ratings")
public class MenuItemRatingController {

    private static final Logger logger = LoggerFactory.getLogger(MenuItemRatingController.class);
    private final MenuItemRatingService ratingService;

    public MenuItemRatingController(MenuItemRatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<?> submitRating(@Valid @RequestBody MenuItemRatingRequest request) {
        try {
            logger.info("Received rating for menu item: {}, rating: {}", request.getMenuItemId(), request.getRating());
            ratingService.submitRating(request);
            return ResponseEntity.ok(Map.of("message", "Rating submitted successfully"));
        } catch (Exception e) {
            logger.error("Error submitting rating", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<TopRatedMenuItemResponse>> getTop5RatedMenuItems() {
        try {
            List<TopRatedMenuItemResponse> topRated = ratingService.getTop5RatedMenuItems();
            return ResponseEntity.ok(topRated);
        } catch (Exception e) {
            logger.error("Error fetching top rated items", e);
            throw e;
        }
    }

    @GetMapping("/menu-item/{menuItemId}")
    public ResponseEntity<?> getRatingStats(@PathVariable Long menuItemId) {
        try {
            Double avgRating = ratingService.getAverageRatingForMenuItem(menuItemId);
            Long totalRatings = ratingService.getTotalRatingsForMenuItem(menuItemId);
            return ResponseEntity.ok(Map.of(
                "averageRating", avgRating != null ? avgRating : 0.0,
                "totalRatings", totalRatings != null ? totalRatings : 0
            ));
        } catch (Exception e) {
            logger.error("Error fetching rating stats", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
