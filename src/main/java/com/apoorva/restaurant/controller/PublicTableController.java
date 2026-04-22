package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.entity.DiningTable;
import com.apoorva.restaurant.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class PublicTableController {

    private final TableService tableService;

    public PublicTableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public ResponseEntity<List<DiningTable>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    @GetMapping("/{tableId}")
    public ResponseEntity<DiningTable> getTableById(@PathVariable Long tableId) {
        try {
            return ResponseEntity.ok(tableService.getTableById(tableId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
