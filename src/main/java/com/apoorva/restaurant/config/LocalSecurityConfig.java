package com.apoorva.restaurant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Profile("local")
public class LocalSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public LocalSecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/menu/**").permitAll()
                .requestMatchers("/api/menu-ratings/**").permitAll()
                .requestMatchers("/api/ai/**").permitAll()
                .requestMatchers("/api/tables/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/add-menu-images").permitAll()
                .requestMatchers("/api/admin/create-feedback-table").permitAll()
                .requestMatchers("/api/admin/reset-table-status").permitAll()
                .requestMatchers("/test").permitAll()
                .requestMatchers("/ws/**").permitAll()
                // Feedback endpoint - public
                .requestMatchers("/api/v1/user/feedback").permitAll()
                // V1 API endpoints
                .requestMatchers("/api/v1/user/tables").authenticated()
                .requestMatchers("/api/v1/user/tables/**").authenticated()
                .requestMatchers("/api/v1/user/orders").authenticated()
                .requestMatchers("/api/v1/user/orders/**").authenticated()
                .requestMatchers("/api/v1/user/reservations").authenticated()
                .requestMatchers("/api/v1/user/reservations/**").authenticated()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                // Legacy endpoints for backward compatibility
                .requestMatchers("/api/reservations/**").authenticated()
                .requestMatchers("/api/orders/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
