package com.apoorva.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "menu_item_ratings")
@SQLRestriction("deleted = false")
@Data
@NoArgsConstructor
public class MenuItemRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(nullable = false)
    private Integer rating; // 1-5 stars

    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private boolean deleted = false;

    public MenuItemRating(MenuItem menuItem, Long userId, String customerName, Integer rating, String comment) {
        this.menuItem = menuItem;
        this.userId = userId;
        this.customerName = customerName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }
}
