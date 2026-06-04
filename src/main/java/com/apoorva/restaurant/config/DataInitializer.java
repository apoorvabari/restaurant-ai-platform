package com.apoorva.restaurant.config;

import com.apoorva.restaurant.entity.MenuItem;
import com.apoorva.restaurant.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;

    public DataInitializer(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public void run(String... args) {
        if (menuItemRepository.count() == 0) {
            List<MenuItem> menuItems = Arrays.asList(
                createMenuItem("MARGHERITA_PIZZA", "Margherita Pizza", "Classic Italian pizza with fresh tomatoes, mozzarella, and basil", "Pizza", 12.99, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500"),
                createMenuItem("PEPPERONI_PIZZA", "Pepperoni Pizza", "Spicy pepperoni with mozzarella cheese and tomato sauce", "Pizza", 14.99, "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500"),
                createMenuItem("CHICKEN_TIKKA_PIZZA", "Chicken Tikka Pizza", "Indian-style pizza with marinated chicken, onions, and peppers", "Pizza", 15.99, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"),
                createMenuItem("VEG_SUPREME_PIZZA", "Veggie Supreme Pizza", "Loaded with bell peppers, mushrooms, olives, and onions", "Pizza", 13.99, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"),
                createMenuItem("HAWAIIAN_PIZZA", "Hawaiian Pizza", "Ham and pineapple with mozzarella cheese", "Pizza", 14.49, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"),
                createMenuItem("SPAGHETTI_CARBONARA", "Spaghetti Carbonara", "Creamy pasta with bacon, eggs, and parmesan cheese", "Pasta", 11.99, "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500"),
                createMenuItem("PENNE_ALFREDO", "Penne Alfredo", "Creamy white sauce pasta with grilled chicken", "Pasta", 12.99, "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500"),
                createMenuItem("LASAGNA", "Lasagna", "Layers of pasta, meat sauce, and cheese", "Pasta", 13.99, "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500"),
                createMenuItem("FETTUCCINE_BOLOGNESE", "Fettuccine Bolognese", "Rich meat sauce with fresh fettuccine pasta", "Pasta", 14.49, "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500"),
                createMenuItem("CHICKEN_ALFREDO", "Chicken Alfredo", "Grilled chicken in creamy garlic sauce over fettuccine", "Pasta", 15.99, "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500"),
                createMenuItem("GRILLED_CHICKEN_SALAD", "Grilled Chicken Salad", "Fresh mixed greens with grilled chicken and vinaigrette", "Salad", 9.99, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500"),
                createMenuItem("CAESAR_SALAD", "Caesar Salad", "Romaine lettuce with croutons, parmesan, and caesar dressing", "Salad", 8.99, "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500"),
                createMenuItem("GREEK_SALAD", "Greek Salad", "Cucumbers, tomatoes, olives, and feta cheese", "Salad", 9.49, "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500"),
                createMenuItem("GARDEN_SALAD", "Garden Salad", "Mixed seasonal vegetables with ranch dressing", "Salad", 7.99, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500"),
                createMenuItem("CHICKEN_WINGS", "Chicken Wings", "Crispy wings with your choice of sauce", "Appetizer", 10.99, "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500"),
                createMenuItem("MOZZARELLA_STICKS", "Mozzarella Sticks", "Golden fried mozzarella with marinara sauce", "Appetizer", 8.99, "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=500"),
                createMenuItem("GARLIC_BREAD", "Garlic Bread", "Toasted bread with garlic butter and herbs", "Appetizer", 5.99, "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500"),
                createMenuItem("ONION_RINGS", "Onion Rings", "Crispy battered onion rings", "Appetizer", 7.99, "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500"),
                createMenuItem("CHOCOLATE_LAVA_CAKE", "Chocolate Lava Cake", "Warm chocolate cake with molten center", "Dessert", 6.99, "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500"),
                createMenuItem("TIRAMISU", "Tiramisu", "Classic Italian dessert with coffee-soaked ladyfingers", "Dessert", 7.99, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500")
            );

            menuItemRepository.saveAll(menuItems);
            System.out.println("Successfully initialized 20 menu items");
        }
    }

    private MenuItem createMenuItem(String code, String name, String description, String category, double price, String imageUrl) {
        MenuItem item = new MenuItem();
        item.setItemCode(code);
        item.setItemName(name);
        item.setDescription(description);
        item.setCategory(category);
        item.setPrice(price);
        item.setAvailable(true);
        item.setImageUrl(imageUrl);
        return item;
    }
}
