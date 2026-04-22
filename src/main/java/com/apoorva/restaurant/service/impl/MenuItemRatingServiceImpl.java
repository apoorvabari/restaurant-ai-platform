package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.dto.MenuItemRatingRequest;
import com.apoorva.restaurant.dto.TopRatedMenuItemResponse;
import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.entity.MenuItemRating;
import com.apoorva.restaurant.repository.MenuItemRatingRepository;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.service.MenuItemRatingService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class MenuItemRatingServiceImpl implements MenuItemRatingService {

    private final MenuItemRatingRepository ratingRepository;
    private final MenuItemRepository menuItemRepository;

    public MenuItemRatingServiceImpl(MenuItemRatingRepository ratingRepository, MenuItemRepository menuItemRepository) {
        this.ratingRepository = ratingRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public void submitRating(MenuItemRatingRequest request) {
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + request.getMenuItemId()));

        // Check if user already rated this item (if userId is provided)
        if (request.getUserId() != null) {
            ratingRepository.findByMenuItemIdAndUserIdAndDeletedFalse(request.getMenuItemId(), request.getUserId())
                    .ifPresent(existingRating -> {
                        existingRating.setDeleted(true);
                        ratingRepository.save(existingRating);
                    });
        }

        MenuItemRating rating = new MenuItemRating(
                menuItem,
                request.getUserId(),
                request.getCustomerName(),
                request.getRating(),
                request.getComment()
        );
        ratingRepository.save(rating);
    }

    @Override
    public List<TopRatedMenuItemResponse> getTop5RatedMenuItems() {
        Pageable top5 = PageRequest.of(0, 5);
        List<Object[]> results = ratingRepository.findTopRatedMenuItems(top5);

        List<TopRatedMenuItemResponse> topRatedItems = new ArrayList<>();

        for (Object[] result : results) {
            Long menuItemId = (Long) result[0];
            Double avgRating = (Double) result[1];
            Long totalRatings = (Long) result[2];

            MenuItem menuItem = menuItemRepository.findById(menuItemId).orElse(null);
            if (menuItem != null) {
                BigDecimal roundedRating = BigDecimal.valueOf(avgRating)
                        .setScale(1, RoundingMode.HALF_UP);

                topRatedItems.add(new TopRatedMenuItemResponse(
                        menuItem.getId(),
                        menuItem.getItemName(),
                        menuItem.getItemCode(),
                        menuItem.getDescription(),
                        menuItem.getPrice(),
                        menuItem.getCategory(),
                        menuItem.getImageUrl(),
                        roundedRating,
                        totalRatings
                ));
            }
        }

        return topRatedItems;
    }

    @Override
    public Double getAverageRatingForMenuItem(Long menuItemId) {
        return ratingRepository.calculateAverageRating(menuItemId);
    }

    @Override
    public Long getTotalRatingsForMenuItem(Long menuItemId) {
        return ratingRepository.countRatingsByMenuItemId(menuItemId);
    }
}
