package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import com.apoorva.restaurant.service.MenuItemService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository menuItemRepository;

    public MenuItemServiceImpl(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @Override
    public MenuItem addMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }
}