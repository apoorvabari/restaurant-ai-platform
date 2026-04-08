package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemServiceImpl implements MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public MenuItem addMenuItem(MenuItem menuItem) {
        if (menuItem.getAvailable() == null) {
            menuItem.setAvailable(true);
        }
        return menuItemRepository.save(menuItem);
    }

    @Override
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @Override
    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    @Override
    public MenuItem updateMenuItem(Long id, MenuItem menuItemDetails) {
        return menuItemRepository.findById(id)
                .map(menuItem -> {
                    menuItem.setItemName(menuItemDetails.getItemName());
                    menuItem.setCategory(menuItemDetails.getCategory());
                    menuItem.setPrice(menuItemDetails.getPrice());

                    if (menuItemDetails.getAvailable() != null) {
                        menuItem.setAvailable(menuItemDetails.getAvailable());
                    }

                    menuItem.setDescription(menuItemDetails.getDescription());
                    return menuItemRepository.save(menuItem);
                })
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
    }

    @Override
    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}