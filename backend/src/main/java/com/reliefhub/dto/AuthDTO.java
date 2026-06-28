package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class AuthDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Username không được để trống")
        private String username;

        @NotBlank(message = "Mật khẩu không được để trống")
        private String password;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Họ tên không được để trống")
        private String fullName;

        @NotBlank(message = "Username không được để trống")
        @Size(min = 3, max = 50, message = "Username phải từ 3-50 ký tự")
        private String username;

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        private String email;

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, message = "Mật khẩu tối thiểu 6 ký tự")
        private String password;

        private String phone;
        private String roleName; // default: 'citizen'
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String tokenType;
        private Long userId;
        private String username;
        private String fullName;
        private String email;
        private String role;
        private String avatarUrl;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class RefreshTokenRequest {
        @NotBlank
        private String refreshToken;
    }
}
