package com.queuevista.security;

import com.queuevista.entity.User;
import com.queuevista.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * CustomUserDetails adapts the User JPA entity into Spring Security's UserDetails principal contract.
 * Viva Explanation:
 * Maps the User entity's role to a GrantedAuthority with the 'ROLE_' prefix (e.g. ROLE_USER, ROLE_ADMIN),
 * enabling Spring Security annotations like @PreAuthorize and hasRole() checks.
 */
@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String fullName;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;

    public static CustomUserDetails build(User user) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        boolean active = user.getStatus() == UserStatus.ACTIVE;

        return new CustomUserDetails(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(authority),
                active
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // Uses email as the principal username in QueueVista
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
