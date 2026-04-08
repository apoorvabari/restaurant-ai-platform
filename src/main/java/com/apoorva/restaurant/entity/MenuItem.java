package com.apoorva.restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Boolean available;

    @Column(length = 500)
    private String description;

    public MenuItem(Long id, String itemName, String category, Double price, Boolean available, String description) {
        this.id = id;
        this.itemName = itemName;
        this.category = category;
        this.price = price;
        this.available = available;
        this.description = description;
    }
}