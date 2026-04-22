package com.apoorva.restaurant;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@EnableScheduling
public class RestaurantApplication {
    private static final Logger logger = LoggerFactory.getLogger(RestaurantApplication.class);

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    public static void main(String[] args) {
        SpringApplication.run(RestaurantApplication.class, args);
    }

    @PostConstruct
    public void init() {
        if (jdbcTemplate != null) {
            try {
                // Check if feedback table exists
                jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'feedback'",
                    Integer.class
                );
            } catch (Exception e) {
                logger.info("Feedback table does not exist, creating it...");
                try {
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
                    logger.info("Feedback table created successfully");
                } catch (Exception ex) {
                    logger.error("Failed to create feedback table", ex);
                }
            }
        }
    }
}