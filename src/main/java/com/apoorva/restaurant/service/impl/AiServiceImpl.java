package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.service.AiService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
        List<MenuItem> allItems = menuItemRepository.findAll();

        if (allItems.isEmpty()) {
            return "Sorry, no menu items available at the moment.";
        }

        String query = customerQuery.toLowerCase(Locale.ROOT);

        // Separate Veg and Non-Veg based on Category + Name
        List<MenuItem> vegItems = new ArrayList<>();
        List<MenuItem> nonVegItems = new ArrayList<>();

        for (MenuItem item : allItems) {
            String itemName = item.getName().toLowerCase(Locale.ROOT);
            String category = (item.getCategory() != null) ? item.getCategory().toLowerCase(Locale.ROOT) : "";

            boolean isNonVeg = 
                category.contains("non-veg") || 
                category.contains("nonveg") || 
                category.contains("non veg") ||
                itemName.contains("chicken") || 
                itemName.contains("mutton") || 
                itemName.contains("fish") || 
                itemName.contains("egg") || 
                itemName.contains("prawn");

            boolean isVeg = 
                category.contains("veg") || 
                category.contains("vegetarian") ||
                itemName.contains("paneer") || 
                itemName.contains("veg") || 
                itemName.contains("margherita") ||
                itemName.contains("dal");

            if (isNonVeg) {
                nonVegItems.add(item);
            } else if (isVeg) {
                vegItems.add(item);
            } else {
                // If unclear, put in veg by default (safe assumption)
                vegItems.add(item);
            }
        }

        if (customerQuery == null || customerQuery.trim().isEmpty()) {
            return "Please provide a valid query.";
        }
        
        // Smart Recommendation based on user query
        if (query.contains("non veg") || query.contains("nonveg") || query.contains("Non-Veg") ||
            query.contains("chicken") || query.contains("mutton") || 
            query.contains("fish")) {
            
            return "🍗 **Non-Veg Recommendations**:\n" + formatItems(nonVegItems);

        } else if (query.contains("veg") || query.contains("vegetarian") || 
                   query.contains("paneer") || query.contains("dal")) {
            
            return "🥗 **Veg Recommendations**:\n" + formatItems(vegItems);

        } else {
            // Default: Show both
            return "🥗 **Veg Options**:\n" + formatItems(vegItems) +
                   "\n\n🍗 **Non-Veg Options**:\n" + formatItems(nonVegItems);
        }
    }

    private String formatItems(List<MenuItem> items) {
        if (items.isEmpty()) {
            return "No items found in this category.";
        }

        return items.stream()
                .limit(5)  // Show maximum 5 recommendations
                .map(item -> "• " + item.getName() + " - ₹" + item.getPrice() +
                            " (" + item.getCategory() + ")")
                .collect(Collectors.joining("\n"));
    }

	@Override
	public String chat(String message) {
		// TODO Auto-generated method stub
		return null;
	}
}