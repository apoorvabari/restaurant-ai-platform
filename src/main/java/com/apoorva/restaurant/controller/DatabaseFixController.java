package com.apoorva.restaurant.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class DatabaseFixController {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseFixController.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/fix-auth0sub")
    public Map<String, Object> fixAuth0subColumn() {
        try {
            // Execute the ALTER TABLE command to make auth0sub nullable
            String sql = "ALTER TABLE users MODIFY COLUMN auth0sub VARCHAR(100) NULL";
            jdbcTemplate.execute(sql);

            // Verify the change
            String checkSql = "SELECT COLUMN_NAME, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'auth0sub'";
            Map<String, Object> result = jdbcTemplate.queryForMap(checkSql);

            return Map.of(
                "success", true,
                "message", "auth0sub column successfully made nullable",
                "columnInfo", result
            );
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", "Failed to fix auth0sub column: " + e.getMessage()
            );
        }
    }

    @PostMapping("/add-menu-images")
    @PreAuthorize("hasAuthority('ADMIN')")
    @SuppressWarnings("all")
    public Map<String, Object> addMenuImages() {
        try {
            int updatedCount = 0;

            // Drop old columns (is_available, is_deleted) since new columns (available, deleted) already exist
            try {
                Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menu_items' AND COLUMN_NAME = 'is_available'",
                    Integer.class
                );
                if (count != null && count > 0) {
                    jdbcTemplate.execute("ALTER TABLE menu_items DROP COLUMN is_available");
                }
            } catch (Exception e) {
                // Column might not exist or error dropping
            }

            try {
                Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menu_items' AND COLUMN_NAME = 'is_deleted'",
                    Integer.class
                );
                if (count != null && count > 0) {
                    jdbcTemplate.execute("ALTER TABLE menu_items DROP COLUMN is_deleted");
                }
            } catch (Exception e) {
                // Column might not exist or error dropping
            }

            // Fix order_items table - drop is_deleted if it exists
            try {
                Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'order_items' AND COLUMN_NAME = 'is_deleted'",
                    Integer.class
                );
                if (count != null && count > 0) {
                    jdbcTemplate.execute("ALTER TABLE order_items DROP COLUMN is_deleted");
                }
            } catch (Exception e) {
                // Column might not exist or error dropping
            }

            // Fix orders table - drop is_deleted if it exists
            try {
                Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'is_deleted'",
                    Integer.class
                );
                if (count != null && count > 0) {
                    jdbcTemplate.execute("ALTER TABLE orders DROP COLUMN is_deleted");
                }
            } catch (Exception e) {
                // Column might not exist or error dropping
            }

            // Add label column to menu_items if it doesn't exist
            try {
                Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menu_items' AND COLUMN_NAME = 'label'",
                    Integer.class
                );
                if (count != null && count == 0) {
                    jdbcTemplate.execute("ALTER TABLE menu_items ADD COLUMN label VARCHAR(20)");
                }
            } catch (Exception e) {
                // Column might exist or error adding
            }

            // Populate label column based on item names
            try {
                // Non-veg items
                jdbcTemplate.execute("UPDATE menu_items SET label = 'non-veg' WHERE item_code IN ('SAL001', 'BUR003', 'WIN005')");
                // Veg items
                jdbcTemplate.execute("UPDATE menu_items SET label = 'veg' WHERE item_code NOT IN ('SAL001', 'BUR003', 'WIN005')");
            } catch (Exception e) {
                // Error updating labels
            }

            // Check current column names
            List<Map<String, Object>> menuColumns = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menu_items' AND COLUMN_NAME IN ('available', 'deleted', 'is_available', 'is_deleted')"
            );

            List<Map<String, Object>> orderItemColumns = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'order_items' AND COLUMN_NAME IN ('deleted', 'is_deleted')"
            );

            List<Map<String, Object>> orderColumns = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'orders' AND COLUMN_NAME IN ('deleted', 'is_deleted')"
            );

            // Add proper image URLs to menu items based on item names
            String[] updates = {
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=500&fit=crop' WHERE item_code = 'SAL001'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=500&fit=crop' WHERE item_code = 'RIS002'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop' WHERE item_code = 'BUR003'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=500&fit=crop' WHERE item_code = 'SAL004'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=500&fit=crop' WHERE item_code = 'WIN005'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&h=500&fit=crop' WHERE item_code = 'DES006'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop' WHERE item_code = 'SOUP007'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500&h=500&fit=crop' WHERE item_code = 'PAS008'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&h=500&fit=crop' WHERE item_code = 'TAN009'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&h=500&fit=crop' WHERE item_code = 'DES010'"
            };

            for (String sql : updates) {
                updatedCount += jdbcTemplate.update(sql);
            }

            // Add 10 new menu items
            String[] newItems = {
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Garlic Bread', 'BRE011', 'Crispy bread with garlic butter and herbs', 120, 'Starter', 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&h=500&fit=crop', 'veg', true, false)",
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Fish and Chips', 'FIS012', 'Battered fish with crispy fries', 380, 'Main Course', 'https://images.unsplash.com/photo-1579205056620-4e8b3a3c3c5d?w=500&h=500&fit=crop', 'non-veg', true, false)",
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Margherita Pizza', 'PIZ013', 'Classic pizza with tomato and mozzarella', 340, 'Main Course', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop', 'veg', true, false)",
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Butter Chicken', 'CHI014', 'Creamy tomato chicken curry', 420, 'Main Course', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop', 'non-veg', true, false)",
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Greek Salad', 'GKS015', 'Fresh salad with feta cheese and olives', 220, 'Starter', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop', 'veg', true, false)",
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Tiramisu', 'TIR016', 'Italian coffee-flavored dessert', 280, 'Dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=500&fit=crop', 'veg', true, false)",
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Spaghetti Bolognese', 'SPA017', 'Pasta with rich meat sauce', 360, 'Main Course', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop', 'non-veg', true, false)",
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Vegetable Stir Fry', 'VEG018', 'Mixed vegetables in Asian sauce', 260, 'Main Course', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop', 'veg', true, false)",
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Lamb Chops', 'LAM019', 'Grilled lamb with herbs', 480, 'Main Course', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&h=500&fit=crop', 'non-veg', true, false)",
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, label, available, deleted) VALUES ('Cheesecake', 'CHE020', 'Creamy cheesecake with berry topping', 290, 'Dessert', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=500&fit=crop', 'veg', true, false)"
            };

            for (String sql : newItems) {
                try {
                    jdbcTemplate.update(sql);
                    updatedCount++;
                } catch (Exception e) {
                    // Item might already exist
                }
            }

            // Update images for existing new items to ensure correctness
            String[] imageUpdates = {
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&h=500&fit=crop' WHERE item_code = 'BRE011'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1579205056620-4e8b3a3c3c5d?w=500&h=500&fit=crop' WHERE item_code = 'FIS012'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop' WHERE item_code = 'PIZ013'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop' WHERE item_code = 'CHI014'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop' WHERE item_code = 'GKS015'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=500&fit=crop' WHERE item_code = 'TIR016'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop' WHERE item_code = 'SPA017'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop' WHERE item_code = 'VEG018'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&h=500&fit=crop' WHERE item_code = 'LAM019'",
                "UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=500&fit=crop' WHERE item_code = 'CHE020'"
            };

            for (String sql : imageUpdates) {
                jdbcTemplate.update(sql);
            }

            // Fix labels for non-veg items that were incorrectly set to veg
            String[] labelUpdates = {
                "UPDATE menu_items SET label = 'non-veg' WHERE item_code IN ('FIS012', 'CHI014', 'SPA017', 'LAM019')"
            };

            for (String sql : labelUpdates) {
                jdbcTemplate.update(sql);
            }

            // Create test user with ID 1 for development/testing
            try {
                String createUserSql = "INSERT INTO users (id, email, password, role, deleted) VALUES (1, 'test@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EHsM8lE9lB', 'USER', false) ON DUPLICATE KEY UPDATE email=email";
                jdbcTemplate.update(createUserSql);
                updatedCount++;
                logger.info("Test user with ID 1 created or already exists");
            } catch (Exception e) {
                logger.warn("Failed to create test user: {}", e.getMessage());
            }

            return Map.of(
                "success", true,
                "message", "Menu item columns standardized and images updated",
                "updatedCount", updatedCount,
                "menuColumns", menuColumns,
                "orderItemColumns", orderItemColumns,
                "orderColumns", orderColumns
            );
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", "Failed to update menu: " + e.getMessage()
            );
        }
    }

    @PostMapping("/standardize-menu-columns")
    @PreAuthorize("permitAll()")
    public Map<String, Object> standardizeMenuColumns() {
        try {
            // Rename is_available to available if it exists
            try {
                jdbcTemplate.execute("ALTER TABLE menu_items CHANGE COLUMN is_available available BOOLEAN DEFAULT TRUE");
            } catch (Exception e) {
                // Column might not exist or already renamed
            }

            // Rename is_deleted to deleted if it exists
            try {
                jdbcTemplate.execute("ALTER TABLE menu_items CHANGE COLUMN is_deleted deleted BOOLEAN DEFAULT FALSE");
            } catch (Exception e) {
                // Column might not exist or already renamed
            }

            return Map.of(
                "success", true,
                "message", "Menu item columns standardized to 'available' and 'deleted'"
            );
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", "Failed to standardize menu columns: " + e.getMessage()
            );
        }
    }

    @PostMapping("/check-menu-columns")
    @PreAuthorize("permitAll()")
    public Map<String, Object> checkMenuColumns() {
        try {
            String sql = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menu_items' AND COLUMN_NAME IN ('available', 'deleted', 'is_available', 'is_deleted')";
            List<Map<String, Object>> columns = jdbcTemplate.queryForList(sql);

            return Map.of(
                "success", true,
                "columns", columns
            );
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", "Failed to check menu columns: " + e.getMessage()
            );
        }
    }

    @PostMapping("/fix-order-items-columns")
    @PreAuthorize("permitAll()")
    public Map<String, Object> fixOrderItemsColumns() {
        try {
            // Drop old column (is_deleted) if it exists
            try {
                Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'order_items' AND COLUMN_NAME = 'is_deleted'",
                    Integer.class
                );
                if (count != null && count > 0) {
                    jdbcTemplate.execute("ALTER TABLE order_items DROP COLUMN is_deleted");
                }
            } catch (Exception e) {
                // Column might not exist or error dropping
            }

            // Check current column names
            List<Map<String, Object>> currentColumns = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'order_items' AND COLUMN_NAME IN ('deleted', 'is_deleted')"
            );

            return Map.of(
                "success", true,
                "message", "Order items columns standardized",
                "currentColumns", currentColumns
            );
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", "Failed to fix order items columns: " + e.getMessage()
            );
        }
    }

    @PostMapping("/fix-reservation-status-column")
    public Map<String, Object> fixReservationStatusColumn() {
        try {
            // Check if status column is ENUM
            String columnTypeSql = "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'reservations' AND COLUMN_NAME = 'status'";
            Map<String, Object> columnInfo = jdbcTemplate.queryForMap(columnTypeSql);
            String columnType = (String) columnInfo.get("COLUMN_TYPE");

            logger.info("Current status column type: {}", columnType);

            // If it's an ENUM, modify it to include ON_GOING
            if (columnType != null && columnType.startsWith("enum")) {
                jdbcTemplate.execute("ALTER TABLE reservations MODIFY COLUMN status ENUM('BOOKED', 'CONFIRMED', 'ON_GOING', 'CANCELLED', 'COMPLETED', 'EXPIRED', 'NO_SHOW') NOT NULL");
                logger.info("Status column updated to include ON_GOING");
            } else {
                // If it's VARCHAR, no change needed
                logger.info("Status column is VARCHAR, no change needed");
            }

            return Map.of(
                "success", true,
                "message", "Reservation status column fixed to accept ON_GOING value",
                "previousColumnType", columnType
            );
        } catch (Exception e) {
            logger.error("Error fixing reservation status column", e);
            return Map.of(
                "success", false,
                "message", "Failed to fix reservation status column: " + e.getMessage()
            );
        }
    }

    @PostMapping("/update-reservation-status-to-ongoing")
    @PreAuthorize("permitAll()")
    public Map<String, Object> updateReservationStatusToOngoing() {
        try {
            // Update all reservations with status 'BOOKED' to 'ON_GOING'
            int updatedCount = jdbcTemplate.update(
                "UPDATE reservations SET status = 'ON_GOING' WHERE status = 'BOOKED' AND deleted = false"
            );

            logger.info("Updated {} reservations from BOOKED to ON_GOING", updatedCount);

            return Map.of(
                "success", true,
                "message", "Updated reservations from BOOKED to ON_GOING",
                "updatedCount", updatedCount
            );
        } catch (Exception e) {
            logger.error("Error updating reservation status", e);
            return Map.of(
                "success", false,
                "message", "Failed to update reservation status: " + e.getMessage()
            );
        }
    }

    @PostMapping("/debug-reservation-status")
    @PreAuthorize("permitAll()")
    public Map<String, Object> debugReservationStatus() {
        try {
            // Check column type
            String columnTypeSql = "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'reservations' AND COLUMN_NAME = 'status'";
            Map<String, Object> columnInfo = jdbcTemplate.queryForMap(columnTypeSql);
            String columnType = (String) columnInfo.get("COLUMN_TYPE");

            // Get current reservation statuses
            String statusCountSql = "SELECT status, COUNT(*) as count FROM reservations WHERE deleted = false GROUP BY status";
            List<Map<String, Object>> statusCounts = jdbcTemplate.queryForList(statusCountSql);

            // Get today's reservations
            String todayReservationsSql = "SELECT id, customer_name, reservation_date, reservation_time, status FROM reservations WHERE deleted = false AND reservation_date = CURDATE() ORDER BY reservation_time";
            List<Map<String, Object>> todayReservations = jdbcTemplate.queryForList(todayReservationsSql);

            return Map.of(
                "success", true,
                "columnType", columnType,
                "statusCounts", statusCounts,
                "todayReservations", todayReservations,
                "currentTime", java.time.LocalTime.now().toString()
            );
        } catch (Exception e) {
            logger.error("Error debugging reservation status", e);
            return Map.of(
                "success", false,
                "message", "Failed to debug reservation status: " + e.getMessage()
            );
        }
    }

    @PostMapping("/force-update-reservation-status")
    public Map<String, Object> forceUpdateReservationStatus() {
        try {
            java.time.LocalTime now = java.time.LocalTime.now();

            // Update BOOKED/CONFIRMED reservations to ON_GOING if time has arrived
            int updatedToOngoing = jdbcTemplate.update(
                "UPDATE reservations SET status = 'ON_GOING' " +
                "WHERE deleted = false " +
                "AND reservation_date = CURDATE() " +
                "AND (reservation_time <= ?) " +
                "AND status IN ('BOOKED', 'CONFIRMED')",
                now.toString()
            );

            // Update ON_GOING reservations to COMPLETED if duration has passed
            int updatedToCompleted = jdbcTemplate.update(
                "UPDATE reservations SET status = 'COMPLETED' " +
                "WHERE deleted = false " +
                "AND reservation_date = CURDATE() " +
                "AND status = 'ON_GOING' " +
                "AND (reservation_time + INTERVAL COALESCE(duration_hours, 2) HOUR) < ?",
                now.toString()
            );

            logger.info("Force updated {} reservations to ON_GOING, {} to COMPLETED", updatedToOngoing, updatedToCompleted);

            return Map.of(
                "success", true,
                "message", "Force updated reservation statuses",
                "updatedToOngoing", updatedToOngoing,
                "updatedToCompleted", updatedToCompleted,
                "currentTime", now.toString()
            );
        } catch (Exception e) {
            logger.error("Error force updating reservation status", e);
            return Map.of(
                "success", false,
                "message", "Failed to force update reservation status: " + e.getMessage()
            );
        }
    }

    @PostMapping("/change-status-column-to-varchar")
    public Map<String, Object> changeStatusColumnToVarchar() {
        try {
            // Change status column from ENUM to VARCHAR(20) to accommodate all status values
            jdbcTemplate.execute("ALTER TABLE reservations MODIFY COLUMN status VARCHAR(20) NOT NULL");

            logger.info("Changed reservations.status column to VARCHAR(20)");

            return Map.of(
                "success", true,
                "message", "Status column changed to VARCHAR(20) successfully"
            );
        } catch (Exception e) {
            logger.error("Error changing status column to VARCHAR", e);
            return Map.of(
                "success", false,
                "message", "Failed to change status column to VARCHAR: " + e.getMessage()
            );
        }
    }

    @PostMapping("/update-menu-item-image")
    public Map<String, Object> updateMenuItemImage(
            @RequestParam String itemName,
            @RequestParam String newImageUrl) {
        try {
            int updated = jdbcTemplate.update(
                "UPDATE menu_items SET image_url = ? WHERE item_name = ?",
                newImageUrl, itemName
            );

            if (updated > 0) {
                logger.info("Updated image for menu item: {}", itemName);
                return Map.of(
                    "success", true,
                    "message", "Image updated successfully for: " + itemName,
                    "updated", updated
                );
            } else {
                logger.warn("No menu item found with name: {}", itemName);
                return Map.of(
                    "success", false,
                    "message", "No menu item found with name: " + itemName
                );
            }
        } catch (Exception e) {
            logger.error("Error updating menu item image", e);
            return Map.of(
                "success", false,
                "message", "Failed to update image: " + e.getMessage()
            );
        }
    }

    @PostMapping("/add-fish-and-chips")
    public Map<String, Object> addFishAndChips(
            @RequestParam(required = false, defaultValue = "https://images.unsplash.com/photo-1579208047982-4e5e7c52d4ea?w=500") String imageUrl) {
        try {
            // Check if item already exists
            List<Map<String, Object>> existing = jdbcTemplate.queryForList(
                "SELECT id FROM menu_items WHERE item_name = 'Fish and Chips' OR item_code = 'FISH01'"
            );

            if (!existing.isEmpty()) {
                return Map.of(
                    "success", false,
                    "message", "Fish and Chips already exists in the menu"
                );
            }

            // Insert new menu item
            jdbcTemplate.update(
                "INSERT INTO menu_items (item_name, item_code, description, price, category, image_url, available, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                "Fish and Chips", "FISH01", "Battered fish with crispy fries", 380.0, "Main Course", imageUrl, true, false
            );

            logger.info("Added Fish and Chips menu item");

            return Map.of(
                "success", true,
                "message", "Fish and Chips added successfully to the menu",
                "imageUrl", imageUrl
            );
        } catch (Exception e) {
            logger.error("Error adding Fish and Chips", e);
            return Map.of(
                "success", false,
                "message", "Failed to add Fish and Chips: " + e.getMessage()
            );
        }
    }

    @PostMapping("/reset-table-status")
    public Map<String, Object> resetTableStatus(
            @RequestParam Integer tableNumber,
            @RequestParam(defaultValue = "AVAILABLE") String newStatus) {
        try {
            // Update table status
            int updated = jdbcTemplate.update(
                "UPDATE dining_tables SET status = ? WHERE table_number = ?",
                newStatus.toUpperCase(), tableNumber
            );

            if (updated > 0) {
                logger.info("Reset table {} status to {}", tableNumber, newStatus);
                return Map.of(
                    "success", true,
                    "message", "Table " + tableNumber + " status reset to " + newStatus,
                    "tableNumber", tableNumber,
                    "newStatus", newStatus
                );
            } else {
                logger.warn("No table found with number: {}", tableNumber);
                return Map.of(
                    "success", false,
                    "message", "No table found with number: " + tableNumber
                );
            }
        } catch (Exception e) {
            logger.error("Error resetting table status", e);
            return Map.of(
                "success", false,
                "message", "Failed to reset table status: " + e.getMessage()
            );
        }
    }

    @PostMapping("/create-feedback-table")
    public Map<String, Object> createFeedbackTable() {
        try {
            // Check if table exists
            List<Map<String, Object>> tables = jdbcTemplate.queryForList(
                "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'feedback'"
            );

            if (!tables.isEmpty()) {
                return Map.of(
                    "success", true,
                    "message", "Feedback table already exists"
                );
            }

            // Create feedback table
            jdbcTemplate.execute(
                "CREATE TABLE feedback (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "customer_name VARCHAR(255) NOT NULL, " +
                "email VARCHAR(255) NOT NULL, " +
                "rating INT NOT NULL, " +
                "comment TEXT NOT NULL, " +
                "order_id VARCHAR(255), " +
                "reservation_id BIGINT, " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "deleted BOOLEAN DEFAULT FALSE)"
            );

            logger.info("Created feedback table");

            return Map.of(
                "success", true,
                "message", "Feedback table created successfully"
            );
        } catch (Exception e) {
            logger.error("Error creating feedback table", e);
            return Map.of(
                "success", false,
                "message", "Failed to create feedback table: " + e.getMessage()
            );
        }
    }
}
