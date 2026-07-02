package com.task.manager.service.impl;

import com.task.manager.dto.request.LoginRequest;
import com.task.manager.dto.request.RegisterRequest;
import com.task.manager.dto.response.AuthResponse;
import com.task.manager.entity.Role;
import com.task.manager.entity.User;
import com.task.manager.exception.UserAlreadyExistsException;
import com.task.manager.exception.UnauthorizedException;
import com.task.manager.exception.ResourceNotFoundException;
import com.task.manager.repository.UserRepository;
import com.task.manager.security.JwtService;
import com.task.manager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
    );

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        validateEmail(email);

        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(toUserDetails(savedUser));

        return toAuthResponse(savedUser, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        validateEmail(email);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        String token = jwtService.generateToken(toUserDetails(user));

        return toAuthResponse(user, token);
    }

    private void validateEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must be valid");
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private UserDetails toUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
