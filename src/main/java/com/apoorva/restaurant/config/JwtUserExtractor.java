package com.apoorva.restaurant.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;


import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for extracting user information from Keycloak JWT tokens
 * 
 * This class provides helper methods to extract user details from the JWT token
 * provided by Keycloak during authentication. It handles the conversion between
 * Keycloak-specific claims and application-specific user information.
 */
@Component
public class JwtUserExtractor {

    /**
     * Extract the user's email from the JWT token
     * Keycloak provides email in the 'email' claim, or we can use 'preferred_username' or 'sub'
     */
    public String extractEmail(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            // Try to get email claim first, then preferred_username, then sub
            return jwt.getClaimAsString("email");
        }
        return authentication.getName();
    }

    /**
     * Extract the user's subject (unique identifier) from the JWT token
     * This is typically the Keycloak user ID
     */
    public String extractSubject(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            return jwt.getSubject();
        }
        return authentication.getName();
    }

    /**
     * Extract the user's roles from the JWT token
     * Returns a list of role strings with ROLE_ prefix already applied
     */
    public List<String> extractRoles(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }

    /**
     * Check if the user has a specific role
     */
    public boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role.toUpperCase()));
    }

    /**
     * Check if the user has any of the specified roles
     */
    public boolean hasAnyRole(Authentication authentication, String... roles) {
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> {
                    String authStr = auth.getAuthority();
                    for (String role : roles) {
                        if (authStr.equals("ROLE_" + role.toUpperCase())) {
                            return true;
                        }
                    }
                    return false;
                });
    }

    /**
     * Extract the user's preferred username from Keycloak token
     * This is typically the username set in Keycloak
     */
    public String extractPreferredUsername(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            return jwt.getClaimAsString("preferred_username");
        }
        return authentication.getName();
    }

    /**
     * Extract the user's full name from Keycloak token if available
     * This combines given_name and family_name claims
     */
    public String extractFullName(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            String givenName = jwt.getClaimAsString("given_name");
            String familyName = jwt.getClaimAsString("family_name");
            
            if (givenName != null && familyName != null) {
                return givenName + " " + familyName;
            } else if (givenName != null) {
                return givenName;
            } else if (familyName != null) {
                return familyName;
            }
        }
        return extractPreferredUsername(authentication);
    }

    /**
     * Extract user ID from Keycloak token
     * This converts the Keycloak subject to a numeric ID if needed
     * Currently, we'll return the subject as a string
     */
    public String extractUserId(Authentication authentication) {
        return extractSubject(authentication);
    }
}
