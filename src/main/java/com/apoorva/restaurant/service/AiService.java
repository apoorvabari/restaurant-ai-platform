package com.apoorva.restaurant.service;

public interface AiService {
    String getMenuRecommendation(String customerQuery);
    String chat(String message);
    
}