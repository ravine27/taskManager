package com.task.manager.service;

import com.task.manager.dto.request.LoginRequest;
import com.task.manager.dto.request.RegisterRequest;
import com.task.manager.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
