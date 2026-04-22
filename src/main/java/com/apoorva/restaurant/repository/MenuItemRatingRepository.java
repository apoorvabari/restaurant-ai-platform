package com.apoorva.restaurant.repository;

import com.apoorva.restaurant.entity.MenuItemRating;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRatingRepository extends JpaRepository<MenuItemRating, Long> {

    List<MenuItemRating> findByMenuItemIdAndDeletedFalse(Long menuItemId);

    Optional<MenuItemRating> findByMenuItemIdAndUserIdAndDeletedFalse(Long menuItemId, Long userId);

    @Query("SELECT r.menuItem.id as menuItemId, AVG(r.rating) as avgRating, COUNT(r.id) as totalRatings " +
           "FROM MenuItemRating r " +
           "WHERE r.deleted = false " +
           "GROUP BY r.menuItem.id " +
           "HAVING COUNT(r.id) >= 1 " +
           "ORDER BY avgRating DESC, totalRatings DESC")
    List<Object[]> findTopRatedMenuItems(Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM MenuItemRating r WHERE r.menuItem.id = :menuItemId AND r.deleted = false")
    Double calculateAverageRating(Long menuItemId);

    @Query("SELECT COUNT(r) FROM MenuItemRating r WHERE r.menuItem.id = :menuItemId AND r.deleted = false")
    Long countRatingsByMenuItemId(Long menuItemId);
}
