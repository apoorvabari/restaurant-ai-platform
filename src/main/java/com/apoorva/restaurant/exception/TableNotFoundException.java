package com.apoorva.restaurant.exception;

@SuppressWarnings("serial")
public class TableNotFoundException extends RuntimeException {
    public TableNotFoundException(String message) {
        super(message);
    }
}
