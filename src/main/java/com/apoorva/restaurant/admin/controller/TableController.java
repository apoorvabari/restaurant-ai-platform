package com.apoorva.restaurant.admin.controller;

import com.apoorva.restaurant.entity.DiningTable;
import com.apoorva.restaurant.entity.DiningTable.TableStatus;
import com.apoorva.restaurant.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/tables")
@PreAuthorize("hasRole('ADMIN')")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public ResponseEntity<List<DiningTable>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    @GetMapping("/{tableId}")
    public ResponseEntity<DiningTable> getTableById(@PathVariable Long tableId) {
        return ResponseEntity.ok(tableService.getTableById(tableId));
    }

    @GetMapping("/number/{tableNumber}")
    public ResponseEntity<DiningTable> getTableByNumber(@PathVariable Integer tableNumber) {
        DiningTable table = tableService.getTableByNumber(tableNumber);
        if (table == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(table);
    }

    @PostMapping
    public ResponseEntity<DiningTable> createTable(@RequestBody DiningTable table) {
        return ResponseEntity.ok(tableService.createTable(table));
    }

    @PutMapping("/{tableId}/status")
    public ResponseEntity<DiningTable> updateTableStatus(
            @PathVariable Long tableId,
            @RequestBody TableStatus status) {
        return ResponseEntity.ok(tableService.updateTableStatus(tableId, status));
    }

    @DeleteMapping("/{tableId}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long tableId) {
        tableService.deleteTable(tableId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/initialize")
    public ResponseEntity<Void> initializeTables() {
        tableService.initializeTables();
        return ResponseEntity.ok().build();
    }
}
