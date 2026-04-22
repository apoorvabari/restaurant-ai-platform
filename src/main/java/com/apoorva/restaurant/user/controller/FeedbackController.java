package com.apoorva.restaurant.user.controller;

import com.apoorva.restaurant.dto.FeedbackRequest;
import com.apoorva.restaurant.dto.FeedbackResponse;
import com.apoorva.restaurant.service.FeedbackService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user/feedback")
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);
    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        try {
            logger.info("Received feedback from customer: {}", request.getCustomerName());
            FeedbackResponse response = feedbackService.submitFeedback(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error submitting feedback", e);
            if (e.getMessage() != null && e.getMessage().contains("Table") && e.getMessage().contains("doesn't exist")) {
                return ResponseEntity.status(500).body(Map.of(
                    "error", "Feedback table not found. Please create it by calling POST /api/admin/create-feedback-table"
                ));
            }
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        try {
            List<FeedbackResponse> feedback = feedbackService.getAllFeedback();
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            logger.error("Error fetching feedback", e);
            throw e;
        }
    }

    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId) {
        try {
            feedbackService.softDeleteFeedback(feedbackId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting feedback", e);
            throw e;
        }
    }
}
