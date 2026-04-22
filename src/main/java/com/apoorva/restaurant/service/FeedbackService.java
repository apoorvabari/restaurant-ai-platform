package com.apoorva.restaurant.service;

import com.apoorva.restaurant.dto.FeedbackRequest;
import com.apoorva.restaurant.dto.FeedbackResponse;

import java.util.List;

public interface FeedbackService {
    FeedbackResponse submitFeedback(FeedbackRequest request);
    List<FeedbackResponse> getAllFeedback();
    void softDeleteFeedback(Long feedbackId);
}
