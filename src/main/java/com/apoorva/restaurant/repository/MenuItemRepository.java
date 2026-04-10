package com.apoorva.restaurant.repository;

import com.apoorva.restaurant.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List; // Correct Import

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    // This method tells Spring: "Search for the keyword in the Name OR the Description"
//	List<MenuItem> findByItemNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
//		    String itemName, String description);


	@Query("SELECT m FROM MenuItem m WHERE LOWER(m.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
		       "OR LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
		List<MenuItem> searchByNameOrDescription(@Param("keyword") String keyword);
	
}