package com.apoorva.restaurant.exception;

@SuppressWarnings("serial")
public class DuplicateBookingException extends RuntimeException {
    public DuplicateBookingException(String message) {
        super(message);
    }
}
