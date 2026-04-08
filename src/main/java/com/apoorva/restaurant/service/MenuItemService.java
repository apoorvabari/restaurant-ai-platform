package com.apoorva.restaurant.service;

import com.apoorva.restaurant.entity.MenuItem;

import java.util.List;
import java.util.Optional;


public interface MenuItemService {
    MenuItem addMenuItem(MenuItem menuItem);
    List<MenuItem> getAllMenuItems();
    Optional<MenuItem> getMenuItemById(Long id);
    MenuItem updateMenuItem(Long id, MenuItem menuItemDetails);
    void deleteMenuItem(Long id);
}

