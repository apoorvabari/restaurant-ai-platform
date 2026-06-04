package com.apoorva.restaurant.service;

import com.apoorva.restaurant.entity.User;
import com.apoorva.restaurant.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Keycloak → MySQL User Synchronisation Service
 *
 * On every authenticated API call this service:
 *   1. Reads the JWT claims from the Keycloak token.
 *   2. Looks up the local `users` table by `keycloak_id` (the stable Keycloak sub UUID).
 *   3. If no row exists yet, creates one automatically (first-login provisioning).
 *   4. If the row exists, updates mutable fields (email, name, role) in case they changed in Keycloak.
 *
 * Controllers must call {@link #getOrCreateUser(Authentication)} instead of
 * userRepository.findByEmail(...).orElseThrow() — that pattern breaks for any
 * user who has never hit the backend before.
 */
@Service
public class KeycloakUserSyncService {

    private static final Logger log = LoggerFactory.getLogger(KeycloakUserSyncService.class);

    private final UserRepository userRepository;

    public KeycloakUserSyncService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns the local {@link User} that mirrors the current Keycloak principal,
     * creating the row if this is the user's first request.
     *
     * @param authentication Spring Security Authentication (must be a JwtAuthenticationToken)
     * @return the persisted, up-to-date User entity
     * @throws IllegalArgumentException if authentication is null or unauthenticated
     */
    @Transactional
    public User getOrCreateUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User is not authenticated");
        }

        Jwt jwt = extractJwt(authentication);

        // --- Extract JWT claims ---
        String keycloakId    = jwt.getSubject();                              // stable UUID
        String email         = jwt.getClaimAsString("email");
        String username      = jwt.getClaimAsString("preferred_username");
        String firstName     = jwt.getClaimAsString("given_name");
        String lastName      = jwt.getClaimAsString("family_name");
        String role          = resolveHighestRole(jwt);

        log.debug("Syncing Keycloak user: sub={}, email={}, username={}, role={}",
                keycloakId, email, username, role);

        // --- Find by keycloakId first (most reliable), fall back to email ---
        Optional<User> existing = userRepository.findByKeycloakId(keycloakId);
        if (existing.isEmpty() && email != null) {
            existing = userRepository.findByEmail(email);
        }

        User user = existing.orElseGet(User::new);

        // --- Upsert fields ---
        boolean isNew = user.getId() == null;
        user.setKeycloakId(keycloakId);
        user.setEmail(email);
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setEnabled(true);

        User saved = userRepository.save(user);

        if (isNew) {
            log.info("Provisioned new local user from Keycloak: id={}, email={}, role={}",
                    saved.getId(), email, role);
        } else {
            log.debug("Updated existing local user from Keycloak: id={}, email={}",
                    saved.getId(), email);
        }

        return saved;
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private Jwt extractJwt(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getToken();
        }
        throw new IllegalArgumentException(
                "Authentication is not a JwtAuthenticationToken: " + authentication.getClass());
    }

    /**
     * Picks the highest-privilege role from Keycloak's `realm_access.roles` claim.
     * Priority: ADMIN > STAFF > USER > fallback "ROLE_USER"
     */
    private String resolveHighestRole(Jwt jwt) {
        try {
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess == null) return "ROLE_USER";

            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) realmAccess.get("roles");
            if (roles == null) return "ROLE_USER";

            if (roles.stream().anyMatch(r -> r.equalsIgnoreCase("admin")))  return "ROLE_ADMIN";
            if (roles.stream().anyMatch(r -> r.equalsIgnoreCase("staff")))  return "ROLE_STAFF";
            if (roles.stream().anyMatch(r -> r.equalsIgnoreCase("user")))   return "ROLE_USER";
        } catch (Exception e) {
            log.warn("Could not extract realm_access.roles from JWT: {}", e.getMessage());
        }
        return "ROLE_USER";
    }
}
