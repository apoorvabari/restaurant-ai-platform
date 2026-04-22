package com.apoorva.restaurant.dto;

import lombok.Data;

@Data
public class TokenRefreshRequest {
    private String refreshToken;
}
