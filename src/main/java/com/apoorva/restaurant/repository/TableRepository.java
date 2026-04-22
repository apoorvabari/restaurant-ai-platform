package com.apoorva.restaurant.repository;

import com.apoorva.restaurant.entity.DiningTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<DiningTable, Long> {
    List<DiningTable> findByDeletedFalse();
    DiningTable findByTableNumber(Integer tableNumber);
}
