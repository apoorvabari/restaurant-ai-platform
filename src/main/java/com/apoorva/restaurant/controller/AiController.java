package com.apoorva.restaurant.controller;

import com.apoorva.restaurant.dto.AiRecommendationRequest;
import com.apoorva.restaurant.dto.AiRecommendationResponse;
import com.apoorva.restaurant.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<AiRecommendationResponse> recommendMenu(@RequestBody(required = false) AiRecommendationRequest request) {

        String customerQuery = request != null ? request.getCustomerQuery() : "";
        String reply = aiService.getMenuRecommendation(customerQuery);

        return ResponseEntity.ok(new AiRecommendationResponse(reply));
    }
}