package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuItemRepository menuItemRepository;

    public MenuController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    // Test Auth Endpoint
    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth() {
        return ResponseEntity.ok("✅ Authentication test successful! Backend is working fine.");
    }

    // Get All Menu Items -> supports GET /api/menu
    @GetMapping
    public ResponseEntity<List<MenuItem>> getMenuItems() {
        List<MenuItem> items = menuItemRepository.findAll();
        return ResponseEntity.ok(items);
    }

    // Optional old endpoint -> supports GET /api/menu/all
    @GetMapping("/all")
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        List<MenuItem> items = menuItemRepository.findAll();
        return ResponseEntity.ok(items);
    }

    
    @PostMapping
    public ResponseEntity<MenuItem> addMenuItem(@RequestBody MenuItem menuItem) {
        MenuItem savedItem = menuItemRepository.save(menuItem);
        return ResponseEntity.ok(savedItem);
    }
    
    // Search Menu Items
    @GetMapping("/search")
    public ResponseEntity<List<MenuItem>> searchMenu(@RequestParam String keyword) {
        List<MenuItem> items = menuItemRepository.findAll().stream()
                .filter(item ->
                        (item.getItemName() != null && item.getItemName().toLowerCase().contains(keyword.toLowerCase())) ||
                        (item.getDescription() != null && item.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .toList();
        return ResponseEntity.ok(items);
    }
}