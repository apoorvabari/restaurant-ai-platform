package com.apoorva.restaurant.entity;
import java.util.List;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String itemName;
//    private String name;

    
    @Column(unique = true, nullable = false)
    private String itemCode;
    
    
    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String category;

    private Boolean is_available = true;
    
    private Boolean is_deleted = true;
    private Boolean deleted_at = true;

    //private String imageUrl;
}