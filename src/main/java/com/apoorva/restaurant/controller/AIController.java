package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.dto.ChatMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody ChatMessage message) {
        // Simple AI response for now - can be enhanced with actual OpenAI integration
        String response = "I received your message: " + message.getText();
        return ResponseEntity.ok(response);
    }
}
