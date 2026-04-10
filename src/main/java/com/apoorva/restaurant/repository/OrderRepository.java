package com.apoorva.restaurant.repository;

import com.apoorva.restaurant.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {  // Fixed: Added <Order, Long>
    List<Order> findByUserId(Long userId);
}