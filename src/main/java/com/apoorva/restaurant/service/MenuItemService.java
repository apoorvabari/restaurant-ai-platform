package com.apoorva.restaurant.service;

import com.apoorva.restaurant.entity.MenuItem;
import java.util.List;

public interface MenuItemService {
    List<MenuItem> getAllMenuItems();
    MenuItem addMenuItem(MenuItem menuItem);
}