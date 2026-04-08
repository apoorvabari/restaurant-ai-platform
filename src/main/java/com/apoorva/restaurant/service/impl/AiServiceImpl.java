package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.service.AiService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class AiServiceImpl implements AiService {

    private final MenuItemRepository menuItemRepository;

    public AiServiceImpl(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public String getMenuRecommendation(String customerQuery) {
        List<MenuItem> menuItems = menuItemRepository.findAll();

        if (menuItems == null || menuItems.isEmpty()) {
            return "Sorry, no menu items are available right now.";
        }

        String query = customerQuery == null ? "" : customerQuery.trim().toLowerCase(Locale.ROOT);

        List<MenuItem> matchedItems;

        if (query.isBlank()) {
            matchedItems = menuItems.stream().limit(3).collect(Collectors.toList());
        } else {
            matchedItems = menuItems.stream()
                    .filter(item ->
                            contains(item.getItemName(), query) ||
                            contains(item.getDescription(), query) ||
                            contains(item.getCategory(), query))
                    .limit(5)
                    .collect(Collectors.toList());
        }

        if (matchedItems.isEmpty()) {
            matchedItems = menuItems.stream().limit(3).collect(Collectors.toList());
        }

        String recommendations = matchedItems.stream()
                .map(item -> item.getItemName() + " - ₹" + item.getPrice())
                .collect(Collectors.joining(", "));

        return "Based on your request, I recommend: " + recommendations;
    }

    private boolean contains(String field, String query) {
        return field != null && field.toLowerCase(Locale.ROOT).contains(query);
    }
}