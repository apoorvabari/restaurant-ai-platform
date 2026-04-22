package com.apoorva.restaurant.user.controller;

import com.apoorva.restaurant.entity.DiningTable;
import com.apoorva.restaurant.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/tables")
public class UserTableController {

    private final TableService tableService;

    public UserTableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public ResponseEntity<List<DiningTable>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    @GetMapping("/available")
    public ResponseEntity<List<DiningTable>> getAvailableTables() {
        List<DiningTable> availableTables = tableService.getAllTables().stream()
                .filter(table -> table.getStatus() == DiningTable.TableStatus.AVAILABLE)
                .toList();
        return ResponseEntity.ok(availableTables);
    }
}
