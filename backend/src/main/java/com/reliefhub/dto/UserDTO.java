package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class UserDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String fullName;
        private String username;
        private String email;
        private String phone;
        private String avatarUrl;
        private String status;
        private String role;
        private String createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateUserRequest {
        private String fullName;
        private String phone;
        private String avatarUrl;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ChangePasswordRequest {
        @NotBlank
        private String oldPassword;
        @NotBlank @Size(min = 6)
        private String newPassword;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateAccountRequest {
        @NotBlank
        private String fullName;
        @NotBlank
        private String username;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
        private String phone;
        @NotBlank
        private String roleName;
    }
}
