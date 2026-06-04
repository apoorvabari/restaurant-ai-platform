package com.apoorva.restaurant.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * MVC configuration placeholder.
 * Global CORS is handled by CorsGlobalConfig at HIGHEST_PRECEDENCE.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    // CORS is handled by CorsGlobalConfig — no duplicate bean needed here.
}

