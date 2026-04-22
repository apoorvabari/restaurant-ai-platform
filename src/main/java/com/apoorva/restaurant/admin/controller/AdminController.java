package com.apoorva.restaurant.admin.controller;

import com.apoorva.restaurant.dto.OrderResponse;
import com.apoorva.restaurant.dto.ReservationResponse;
import com.apoorva.restaurant.entity.DiningTable;
import com.apoorva.restaurant.service.OrderService;
import com.apoorva.restaurant.service.ReservationService;
import com.apoorva.restaurant.service.TableService;
import com.apoorva.restaurant.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ReservationService reservationService;
    private final TableService tableService;
    private final OrderService orderService;
    private final UserService userService;

    public AdminController(ReservationService reservationService,
                          TableService tableService,
                          OrderService orderService,
                          UserService userService) {
        this.reservationService = reservationService;
        this.tableService = tableService;
        this.orderService = orderService;
        this.userService = userService;
    }

    // Get system statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalReservations", reservationService.getAllReservations().size());
        stats.put("totalTables", tableService.getAllTables().size());
        stats.put("totalOrders", orderService.getAllOrders().size());

        // Count tables by status
        long availableTables = tableService.getAllTables().stream()
                .filter(t -> t.getStatus() == DiningTable.TableStatus.AVAILABLE)
                .count();
        long bookedTables = tableService.getAllTables().stream()
                .filter(t -> t.getStatus() == DiningTable.TableStatus.BOOKED)
                .count();
        long occupiedTables = tableService.getAllTables().stream()
                .filter(t -> t.getStatus() == DiningTable.TableStatus.OCCUPIED)
                .count();

        stats.put("availableTables", availableTables);
        stats.put("bookedTables", bookedTables);
        stats.put("occupiedTables", occupiedTables);

        return ResponseEntity.ok(stats);
    }

    // Get all reservations with pagination
    @GetMapping("/reservations")
    public ResponseEntity<Page<ReservationResponse>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reservationService.getAllReservations(pageable));
    }

    // Delete reservation
    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.softDeleteReservation(id);
        return ResponseEntity.ok().build();
    }

    // Get all orders
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Delete order
    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.softDeleteOrder(id);
        return ResponseEntity.ok().build();
    }

    // Update order status
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // Update user role
    @PutMapping("/users/{email}/role")
    public ResponseEntity<Void> updateUserRole(
            @PathVariable String email,
            @RequestParam String role) {
        com.apoorva.restaurant.entity.User user = userService.findByEmail(email);
        user.setRole(role);
        return ResponseEntity.ok().build();
    }

    // Expire old reservations
    @PostMapping("/reservations/expire")
    public ResponseEntity<Map<String, Integer>> expireOldReservations() {
        int expiredCount = reservationService.expireOldReservations();
        Map<String, Integer> result = new HashMap<>();
        result.put("expiredCount", expiredCount);
        return ResponseEntity.ok(result);
    }
}
