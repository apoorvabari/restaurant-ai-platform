package com.apoorva.restaurant.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class ConnectivityLogger implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(ConnectivityLogger.class);

    private final JdbcTemplate jdbcTemplate;

    public ConnectivityLogger(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("--- DATABASE VERIFICATION REPORT ---");
            
            dumpTable("menu_items");
            dumpTable("orders");
            dumpTable("order_items");
            dumpTable("reservations");
            dumpTable("users");

            logger.info("------------------------------------");
        } catch (Exception e) {
            logger.error("Database verification failed: {}", e.getMessage(), e);
        }
    }

    private void dumpTable(String tableName) {
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT * FROM " + tableName);
            logger.info("Table [{}]: {} rows found", tableName, rows.size());
            if (!rows.isEmpty()) {
                logger.debug("Table [{}] columns: {}", tableName, rows.get(0).keySet());
                rows.stream().limit(5).forEach(row -> logger.debug("Table [{}] row: {}", tableName, row.values()));
                if (rows.size() > 5) logger.debug("Table [{}] ... and {} more rows", tableName, rows.size() - 5);
            }
        } catch (Exception e) {
            logger.warn("Table [{}] could not be queried (it may not exist yet): {}", tableName, e.getMessage());
        }
    }
}
