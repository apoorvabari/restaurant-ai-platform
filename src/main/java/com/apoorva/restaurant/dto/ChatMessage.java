package com.apoorva.restaurant.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatMessage {
    private String role; // "user" or "ai"
    private String text;

    public ChatMessage(String role, String text) {
        this.role = role;
        this.text = text;
    }
}
