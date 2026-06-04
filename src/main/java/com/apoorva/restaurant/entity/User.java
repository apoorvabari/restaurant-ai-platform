package com.apoorva.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Local mirror of a Keycloak user.
 *
 * On every authenticated request the KeycloakUserSyncService upserts this record
 * using the JWT's `sub` claim as the authoritative identifier.
 * Password is intentionally absent — Keycloak owns authentication.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Keycloak user UUID (`sub` claim) — stable, never changes. */
    @Column(name = "keycloak_id", unique = true)
    private String keycloakId;

    @Column(unique = true)
    private String email;

    /** Keycloak preferred_username */
    private String username;

    private String firstName;
    private String lastName;

    private String phone;

    /** Highest Keycloak realm role granted to this user (e.g. ROLE_USER, ROLE_ADMIN). */
    @Column(nullable = false)
    private String role;

    private boolean enabled = true;
}
