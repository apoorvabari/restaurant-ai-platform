package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
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

    // Add Menu Item -> supports POST /api/menu
    @PostMapping
    public ResponseEntity<MenuItem> addMenuItem(@RequestBody MenuItem menuItem) {
        MenuItem savedItem = menuItemRepository.save(menuItem);
        return ResponseEntity.ok(savedItem);
    }

    // Delete Menu Item -> supports DELETE /api/menu/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Search Menu Items
    @GetMapping("/search")
    public ResponseEntity<List<MenuItem>> searchMenu(@RequestParam String keyword) {
        List<MenuItem> items = menuItemRepository.findAll().stream()
                .filter(item -> (item.getItemName() != null
                        && item.getItemName().toLowerCase().contains(keyword.toLowerCase())) ||
                        (item.getDescription() != null
                                && item.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .toList();
        return ResponseEntity.ok(items);
    }

    // Initialize Menu Items
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeMenuItems() {
        if (menuItemRepository.count() > 0) {
            return ResponseEntity.ok("Menu items already exist. Skipping initialization.");
        }

        List<MenuItem> items = List.of(
                createMenuItem("Grilled Salmon", "SAL001", "Fresh salmon grilled with herbs", 450.00, "Main Course",
                        "https://images.pexels.com/photos/7627415/pexels-photo-7627415.jpeg"),
                createMenuItem("Truffle Risotto", "RIS002", "Creamy risotto with truffle oil", 350.00, "Main Course",
                        "https://images.pexels.com/photos/2067418/pexels-photo-2067418.jpeg"),
                createMenuItem("Caesar Salad", "SAL004", "Classic Caesar salad with parmesan", 250.00, "Starter",
                        "https://images.pexels.com/photos/8251537/pexels-photo-8251537.jpeg"),
                createMenuItem("Chicken Wings", "WIN005", "Spicy chicken wings with dip", 300.00, "Starter",
                        "https://images.pexels.com/photos/10648394/pexels-photo-10648394.jpeg"),
                createMenuItem("Chocolate Lava Cake", "DES006", "Warm chocolate cake with molten center", 200.00,
                        "Dessert", "https://images.pexels.com/photos/11076351/pexels-photo-11076351.jpeg"),
                createMenuItem("Tomato Soup", "SOUP007", "Rich tomato soup with basil", 180.00, "Starter",
                        "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg"),
                createMenuItem("Pasta Alfredo", "PAS008", "Creamy Alfredo pasta with mushrooms", 320.00, "Main Course",
                        "https://images.pexels.com/photos/11220208/pexels-photo-11220208.jpeg"),
                createMenuItem("Tandoori Paneer", "TAN009", "Paneer marinated in spices and grilled", 280.00,
                        "Main Course", "https://images.pexels.com/photos/28674559/pexels-photo-28674559.jpeg"),
                createMenuItem("Ice Cream Sundae", "DES010", "Vanilla ice cream with toppings", 150.00, "Dessert",
                        "https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg"),
                createMenuItem("Margherita Pizza", "PIZ011", "Classic pizza with tomato, mozzarella, and basil", 300.00,
                        "Main Course", "https://images.pexels.com/photos/19681747/pexels-photo-19681747.jpeg"),
                createMenuItem("Butter Chicken", "CUR012", "Creamy tomato-based curry with tender chicken", 400.00,
                        "Main Course", "https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg"),
                createMenuItem("Veg Biryani", "BIR013", "Fragrant rice cooked with vegetables and spices", 350.00,
                        "Main Course", "https://images.pexels.com/photos/7340956/pexels-photo-7340956.jpeg"),
                createMenuItem("Paneer Tikka", "TIK014", "Grilled paneer cubes marinated in spices", 280.00, "Starter",
                        "https://images.pexels.com/photos/28674559/pexels-photo-28674559.jpeg"),
                createMenuItem("French Fries", "FRI015", "Crispy golden potato fries", 150.00, "Starter",
                        "https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg"),
                createMenuItem("Mango Lassi", "DRK016", "Refreshing yogurt drink with mango pulp", 120.00, "Beverage",
                        "https://images.pexels.com/photos/14509267/pexels-photo-14509267.jpeg"),
                createMenuItem("Masala Dosa", "DOS017", "Crispy rice crepe stuffed with spiced potatoes", 200.00,
                        "Main Course", "https://images.pexels.com/photos/32229637/pexels-photo-32229637.png"),
                createMenuItem("Spring Rolls", "ROL018", "Vegetable spring rolls served with dip", 180.00, "Starter",
                        "https://images.pexels.com/photos/6646369/pexels-photo-6646369.jpeg"),
                createMenuItem("Gulab Jamun", "DES019", "Soft fried milk balls soaked in syrup", 100.00, "Dessert",
                        "https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg"),
                createMenuItem("Cold Coffee", "DRK020", "Chilled coffee blended with milk and ice cream", 150.00,
                        "Beverage", "https://images.pexels.com/photos/2374795/pexels-photo-2374795.jpeg"));

        menuItemRepository.saveAll(items);
        return ResponseEntity.ok("Menu items initialized successfully with " + items.size() + " items.");
    }

    private MenuItem createMenuItem(String name, String code, String description, Double price, String category,
            String imageUrl) {
        MenuItem item = new MenuItem();
        item.setItemName(name);
        item.setItemCode(code);
        item.setDescription(description);
        item.setPrice(price);
        item.setCategory(category);
        item.setImageUrl(imageUrl);
        item.setAvailable(true);
        item.setDeleted(false);
        return item;
    }
}