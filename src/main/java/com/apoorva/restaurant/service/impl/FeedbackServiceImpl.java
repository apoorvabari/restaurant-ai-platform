package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.dto.FeedbackRequest;
import com.apoorva.restaurant.dto.FeedbackResponse;
import com.apoorva.restaurant.entity.Feedback;
import com.apoorva.restaurant.repository.FeedbackRepository;
import com.apoorva.restaurant.service.FeedbackService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("all")
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    public FeedbackResponse submitFeedback(FeedbackRequest request) {
        Feedback feedback = new Feedback(
            request.getCustomerName(),
            request.getEmail(),
            request.getRating(),
            request.getComment(),
            request.getOrderId(),
            request.getReservationId()
        );
        Feedback saved = feedbackRepository.save(feedback);
        return new FeedbackResponse(
            saved.getId(),
            saved.getCustomerName(),
            saved.getEmail(),
            saved.getRating(),
            saved.getComment(),
            saved.getOrderId(),
            saved.getReservationId(),
            saved.getCreatedAt()
        );
    }

    @Override
    public List<FeedbackResponse> getAllFeedback() {
        return feedbackRepository.findByDeletedFalse().stream()
                .map(f -> new FeedbackResponse(
                    f.getId(),
                    f.getCustomerName(),
                    f.getEmail(),
                    f.getRating(),
                    f.getComment(),
                    f.getOrderId(),
                    f.getReservationId(),
                    f.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void softDeleteFeedback(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        feedback.setDeleted(true);
        feedbackRepository.save(feedback);
    }
}
