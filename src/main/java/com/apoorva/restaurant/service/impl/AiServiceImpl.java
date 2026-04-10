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
        List<MenuItem> allItems = menuItemRepository.findAll();

        if (allItems.isEmpty()) {
            return "Sorry, no menu items are available right now.";
        }

        String query = (customerQuery == null ? "" : customerQuery)
                .toLowerCase(Locale.ROOT).trim();

        // Priority 1: Exact or strong name match
        List<MenuItem> matchedItems = allItems.stream()
                .filter(item -> strongNameMatch(item, query))
                .collect(Collectors.toList());

        // Priority 2: Broader search if no strong match
        if (matchedItems.isEmpty()) {
            matchedItems = allItems.stream()
                    .filter(item -> broadMatch(item, query))
                    .collect(Collectors.toList());
        }

        boolean wantsNonVeg = isNonVegQuery(query);
        boolean wantsVeg = isVegQuery(query);

        if (wantsNonVeg) {
            List<MenuItem> result = matchedItems.stream()
                    .filter(this::isNonVegItem)
                    .collect(Collectors.toList());
            if (result.isEmpty()) {
                result = allItems.stream().filter(this::isNonVegItem).collect(Collectors.toList());
            }
            return formatResponse("🍗 NON-VEG RECOMMENDATIONS", result);
        }

        if (wantsVeg) {
            List<MenuItem> result = matchedItems.stream()
                    .filter(this::isVegItem)
                    .collect(Collectors.toList());
            if (result.isEmpty()) {
                result = allItems.stream().filter(this::isVegItem).collect(Collectors.toList());
            }
            return formatResponse("🥬 VEG RECOMMENDATIONS", result);
        }

        // Specific item search (like "Lassi", "Paneer", "Biryani")
        if (!matchedItems.isEmpty()) {
            return formatResponse("🍽️ RECOMMENDED FOR '" + customerQuery + "'", matchedItems);
        }

        // Only as last resort
        return formatBothResponses(allItems);
    }

    @Override
    public String chat(String message) {
        if (message == null || message.trim().isEmpty()) {
            return "Please enter a message.";
        }
        return getMenuRecommendation(message);
    }

    // ====================== STRICT MATCHING ======================

    private boolean strongNameMatch(MenuItem item, String query) {
        String name = getLower(item.getItemName());
        return name.contains(query) || query.contains(name);
    }

    private boolean broadMatch(MenuItem item, String query) {
        if (query.isEmpty()) return true;

        String name = getLower(item.getItemName());
        String desc = getLower(item.getDescription());
        String cat  = getLower(item.getCategory());

        String[] words = query.split("\\s+");

        for (String word : words) {
            if (word.length() < 3) continue;
            if (name.contains(word) || desc.contains(word) || cat.contains(word)) {
                return true;
            }
        }

        return false;
    }

    private boolean isVegQuery(String query) {
        return query.contains("veg") || query.contains("vegetarian") || 
               query.contains("paneer") || query.contains("dal");
    }

    private boolean isNonVegQuery(String query) {
        return query.contains("non") || query.contains("chicken") || query.contains("mutton") ||
               query.contains("fish") || query.contains("egg") || query.contains("meat");
    }

    private boolean isVegItem(MenuItem item) {
        String name = getLower(item.getItemName());
        return name.contains("paneer") || name.contains("veg") || name.contains("dal") ||
               name.contains("raita") || name.contains("paratha") || name.contains("naan") ||
               name.contains("kofta") || name.contains("mushroom") || name.contains("palak");
    }

    private boolean isNonVegItem(MenuItem item) {
        String name = getLower(item.getItemName());
        return name.contains("chicken") || name.contains("mutton") || name.contains("fish") ||
               name.contains("egg") || (name.contains("biryani") && !name.contains("veg"));
    }

    private String getLower(String str) {
        return str == null ? "" : str.toLowerCase(Locale.ROOT);
    }

    private String formatResponse(String title, List<MenuItem> items) {
        if (items.isEmpty()) {
            return "Sorry, no matching items found for '" + title + "'.";
        }

        String list = items.stream()
                .limit(8)
                .map(item -> "• " + item.getItemName() + " - ₹" + item.getPrice())
                .collect(Collectors.joining("\n"));

        return title + ":\n" + list;
    }

    private String formatBothResponses(List<MenuItem> allItems) {
        List<MenuItem> veg = allItems.stream().filter(this::isVegItem).limit(5).toList();
        List<MenuItem> nonVeg = allItems.stream().filter(this::isNonVegItem).limit(5).toList();

        StringBuilder sb = new StringBuilder("Here are some popular items:\n\n");
        sb.append("🥬 VEG:\n");
        veg.forEach(i -> sb.append("• ").append(i.getItemName()).append(" - ₹").append(i.getPrice()).append("\n"));
        sb.append("\n🍗 NON-VEG:\n");
        nonVeg.forEach(i -> sb.append("• ").append(i.getItemName()).append(" - ₹").append(i.getPrice()).append("\n"));

        return sb.toString();
    }
}