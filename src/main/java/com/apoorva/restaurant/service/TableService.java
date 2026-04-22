package com.apoorva.restaurant.service;

import com.apoorva.restaurant.entity.DiningTable;
import com.apoorva.restaurant.entity.DiningTable.TableStatus;

import java.util.List;

public interface TableService {
    List<DiningTable> getAllTables();
    DiningTable getTableById(Long tableId);
    DiningTable getTableByNumber(Integer tableNumber);
    DiningTable createTable(DiningTable table);
    DiningTable updateTableStatus(Long tableId, TableStatus status);
    void deleteTable(Long tableId);
    void initializeTables();
}
