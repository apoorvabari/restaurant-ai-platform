package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestController {

    private final MenuItemRepository menuItemRepository;

    public TestController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public String testApi() {
        return "Restaurant backend is running";
    }

    @GetMapping("/test/menu-count")
    @PreAuthorize("hasRole('ADMIN')")
    public String testMenuCount() {
        List<MenuItem> items = menuItemRepository.findAll();
        return "Menu items count: " + items.size();
    }
}