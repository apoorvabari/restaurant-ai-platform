package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.dto.MenuItemRequest;
import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.service.MenuItemService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
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
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(request.getAvailable());
        return ResponseEntity.ok(menuItemRepository.save(item));
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }

   
    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth() {
        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body("Not Authenticated - Anonymous User");
        }

        String debugInfo = "User: " + auth.getName() + " | Roles: " + auth.getAuthorities();
        System.out.println("DEBUG SUCCESS: " + debugInfo);
        
        return ResponseEntity.ok("Authenticated! " + debugInfo);
    }
}