package com.apoorva.restaurant.admin.service;

import com.apoorva.restaurant.dto.OrderResponse;
import com.apoorva.restaurant.dto.ReservationResponse;
import com.apoorva.restaurant.entity.DiningTable;
import com.apoorva.restaurant.entity.User;
import com.apoorva.restaurant.service.OrderService;
import com.apoorva.restaurant.service.ReservationService;
import com.apoorva.restaurant.service.TableService;
import com.apoorva.restaurant.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AdminService {

    private final ReservationService reservationService;
    private final TableService tableService;
    private final OrderService orderService;
    private final UserService userService;

    public AdminService(ReservationService reservationService,
                       TableService tableService,
                       OrderService orderService,
                       UserService userService) {
        this.reservationService = reservationService;
        this.tableService = tableService;
        this.orderService = orderService;
        this.userService = userService;
    }

    // System Statistics
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReservations", reservationService.getAllReservations().size());
        stats.put("totalTables", tableService.getAllTables().size());
        stats.put("totalOrders", orderService.getAllOrders().size());

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

        return stats;
    }

    // Reservation Management
    public Page<ReservationResponse> getAllReservations(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reservationService.getAllReservations(pageable);
    }

    public void deleteReservation(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Reservation ID cannot be null");
        }
        reservationService.softDeleteReservation(id);
    }

    public int expireOldReservations() {
        return reservationService.expireOldReservations();
    }

    // Order Management
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    public void deleteOrder(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        orderService.softDeleteOrder(id);
    }

    public OrderResponse updateOrderStatus(Long id, String status) {
        if (id == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }
        return orderService.updateOrderStatus(id, status);
    }

    // User Management
    public void updateUserRole(String email, String role) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (role == null || role.trim().isEmpty()) {
            throw new IllegalArgumentException("Role cannot be null or empty");
        }
        User user = userService.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        user.setRole(role);
    }

    // Table Management
    public List<DiningTable> getAllTables() {
        return tableService.getAllTables();
    }

    public DiningTable updateTableStatus(Long id, String status) {
        if (id == null) {
            throw new IllegalArgumentException("Table ID cannot be null");
        }
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }
        DiningTable.TableStatus tableStatus = DiningTable.TableStatus.valueOf(status.toUpperCase());
        return tableService.updateTableStatus(id, tableStatus);
    }
}
