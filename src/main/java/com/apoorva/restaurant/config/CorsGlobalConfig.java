package com.apoorva.restaurant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.List;

/**
 * Global CORS filter that guarantees the Access‑Control headers are added for
 * every request, regardless of the Spring Security filter chain configuration.
 * This is a safety‑net for the dev environment (http://localhost:3000).
 */
@Configuration
public class CorsGlobalConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // allowed origin for the React dev server
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        // HTTP methods we support
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // any header is allowed (including Authorization)
        config.setAllowedHeaders(List.of("*"));
        // the browser is allowed to send cookies / Authorization header
        config.setAllowCredentials(true);
        // register for all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
