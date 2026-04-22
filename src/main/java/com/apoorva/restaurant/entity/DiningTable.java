package com.apoorva.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "dining_tables")
@SQLRestriction("deleted = false")
@Data
@NoArgsConstructor
public class DiningTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Integer tableNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TableStatus status = TableStatus.AVAILABLE;

    @Column(nullable = false)
    private Integer capacity = 4;

    private boolean deleted = false;

    public DiningTable(Integer tableNumber, TableStatus status, Integer capacity) {
        this.tableNumber = tableNumber;
        this.status = status;
        this.capacity = capacity;
    }

    public enum TableStatus {
        AVAILABLE,
        BOOKED,
        OCCUPIED,
        EXPIRED
    }
}
