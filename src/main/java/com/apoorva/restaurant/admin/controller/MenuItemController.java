package com.apoorva.restaurant.admin.controller;

import com.apoorva.restaurant.dto.MenuItemRequest;
import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.service.MenuItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/menu-items")
@PreAuthorize("hasRole('ADMIN')")
public class MenuItemController {

    private final MenuItemRepository menuItemRepository;
    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemRepository menuItemRepository, MenuItemService menuItemService) {
        this.menuItemRepository = menuItemRepository;
        this.menuItemService = menuItemService;
    }

    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItemRequest request) {
        MenuItem item = new MenuItem();
        item.setItemCode(request.getItemCode());
        item.setItemName(request.getItemName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        item.setAvailable(request.getAvailable());
        item.setImageUrl(request.getImageUrl());
        return ResponseEntity.ok(menuItemRepository.save(item));
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }
}
