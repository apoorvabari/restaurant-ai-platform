package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.entity.DiningTable;
import com.apoorva.restaurant.entity.DiningTable.TableStatus;
import com.apoorva.restaurant.exception.TableNotFoundException;
import com.apoorva.restaurant.repository.TableRepository;
import com.apoorva.restaurant.service.TableService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@SuppressWarnings("all")
public class TableServiceImpl implements TableService, CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(TableServiceImpl.class);
    private final TableRepository tableRepository;

    public TableServiceImpl(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        initializeTables();
    }

    @Override
    public List<DiningTable> getAllTables() {
        try {
            return tableRepository.findByDeletedFalse();
        } catch (Exception e) {
            logger.error("Error fetching all tables", e);
            throw new RuntimeException("Failed to fetch tables", e);
        }
    }

    @Override
    public DiningTable getTableById(Long tableId) {
        try {
            return tableRepository.findById(tableId)
                    .orElseThrow(() -> new TableNotFoundException("Table not found with id: " + tableId));
        } catch (TableNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching table with id: {}", tableId, e);
            throw new RuntimeException("Failed to fetch table", e);
        }
    }

    @Override
    public DiningTable getTableByNumber(Integer tableNumber) {
        try {
            return tableRepository.findByTableNumber(tableNumber);
        } catch (Exception e) {
            logger.error("Error fetching table with number: {}", tableNumber, e);
            throw new RuntimeException("Failed to fetch table", e);
        }
    }

    @Override
    @Transactional
    public DiningTable createTable(DiningTable table) {
        try {
            // Validate table number is not null and positive
            if (table.getTableNumber() == null || table.getTableNumber() <= 0) {
                throw new RuntimeException("Table number must be a positive integer");
            }
            
            // Check if table number already exists
            if (tableRepository.findByTableNumber(table.getTableNumber()) != null) {
                throw new RuntimeException("Table with number " + table.getTableNumber() + " already exists");
            }
            
            // Validate capacity is within reasonable range
            if (table.getCapacity() == null || table.getCapacity() < 1 || table.getCapacity() > 20) {
                throw new RuntimeException("Table capacity must be between 1 and 20");
            }
            
            return tableRepository.save(table);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error creating table", e);
            throw new RuntimeException("Failed to create table", e);
        }
    }

    @Override
    @Transactional
    public DiningTable updateTableStatus(Long tableId, TableStatus status) {
        try {
            DiningTable table = getTableById(tableId);
            table.setStatus(status);
            return tableRepository.save(table);
        } catch (TableNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error updating table status for table id: {}", tableId, e);
            throw new RuntimeException("Failed to update table status", e);
        }
    }

    @Override
    @Transactional
    public void deleteTable(Long tableId) {
        try {
            DiningTable table = getTableById(tableId);
            table.setDeleted(true);
            tableRepository.save(table);
        } catch (TableNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error deleting table with id: {}", tableId, e);
            throw new RuntimeException("Failed to delete table", e);
        }
    }

    @Override
    @Transactional
    public void initializeTables() {
        try {
            long existingCount = tableRepository.count();
            logger.info("Table initialization started. Existing count: {}", existingCount);
            
            if (existingCount == 0) {
                for (int i = 1; i <= 10; i++) {
                    DiningTable table = new DiningTable(i, TableStatus.AVAILABLE, 4);
                    tableRepository.save(table);
                    logger.info("Created table: {}", i);
                }
                logger.info("Initialized 10 dining tables successfully");
            } else {
                logger.info("Tables already exist: {} tables found", existingCount);
            }
        } catch (Exception e) {
            logger.error("Error initializing tables", e);
            throw new RuntimeException("Failed to initialize tables", e);
        }
    }
}
