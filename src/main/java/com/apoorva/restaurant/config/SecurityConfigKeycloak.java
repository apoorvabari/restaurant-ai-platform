package com.apoorva.restaurant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Keycloak OAuth2 Resource Server Security Configuration
 * 
 * This configuration uses Keycloak as the sole authentication provider for the application.
 * It leverages Spring Security's OAuth2 Resource Server support with JWT decoder.
 * 
 * Key features:
 * - Stateless JWT authentication using Keycloak tokens
 * - CORS configuration for frontend integration
 * - Role-based access control with ROLE_ prefix conversion
 * - Public endpoints for unauthenticated access
 * - Protected endpoints requiring valid Keycloak tokens
 */
@Configuration
@EnableWebSecurity
public class SecurityConfigKeycloak {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for stateless API
            .csrf(csrf -> csrf.disable())
            
            // Enable CORS - must be before security rules
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configure OAuth2 Resource Server with JWT
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            )
            
            // Configure session management to stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no authentication required
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/menu/**").permitAll()
                .requestMatchers("/api/menu-ratings/**").permitAll()
                .requestMatchers("/api/ai/**").permitAll()
                .requestMatchers("/api/reservations/**").permitAll()
                .requestMatchers("/api/tables/**").permitAll()
                .requestMatchers("/api/orders/**").permitAll()
                .requestMatchers("/api/admin/create-feedback-table").permitAll()
                .requestMatchers("/api/admin/reset-table-status").permitAll()
                .requestMatchers("/api/v1/user/**").permitAll()
                
                // Swagger/OpenAPI documentation endpoints (public for development)
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**").permitAll()
                
                // Health check and actuator endpoints
                .requestMatchers("/actuator/**").permitAll()
                
                // WebSocket endpoints
                .requestMatchers("/ws/**").permitAll()
                
                // OPTIONS requests for CORS preflight
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                
                // All other endpoints require authentication
                .requestMatchers("/api/**").authenticated()
                
                // Allow all other requests (health checks, etc.)
                .anyRequest().permitAll()
            );

        return http.build();
    }

    /**
     * JWT Decoder for validating Keycloak JWT tokens
     * Uses the JWK Set URI from Keycloak to verify token signatures
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(
            "http://localhost:8180/realms/restaurant-realm/protocol/openid-connect/certs"
        ).build();
    }

    /**
     * JWT Authentication Converter
     * Converts JWT tokens into Authentication objects with proper authorities
     * 
     * This converter:
     * - Extracts roles from Keycloak's realm_access.roles claim
     * - Converts role names to Spring Security format with ROLE_ prefix
     * - Sets the principal to the user's email/sub from Keycloak
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        
        // Configure how to extract roles from Keycloak token
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("realm_access.roles");
        
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        
        // Set the principal claim name to use email/sub from Keycloak
        converter.setPrincipalClaimName("preferred_username");
        
        return converter;
    }

    /**
     * CORS Configuration Source
     * 
     * Allows cross-origin requests from the frontend running on localhost:3000
     * This is essential for SPA (Single Page Application) integration
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow frontend origin
        config.setAllowedOrigins(List.of("http://localhost:5176"));
        
        // Allow necessary HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Allow all headers (including Authorization)
        config.setAllowedHeaders(List.of("*"));
        
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Expose headers for frontend consumption
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
