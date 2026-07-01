package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.UserDTO;
import com.reliefhub.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Quản lý người dùng và tài khoản")
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy danh sách tất cả người dùng (Admin only)")
    public ResponseEntity<ApiResponse<List<UserDTO.UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin người dùng hiện tại")
    public ResponseEntity<ApiResponse<UserDTO.UserResponse>> getCurrentUser() {
        return ResponseEntity.ok(ApiResponse.success(userService.getCurrentUser()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy thông tin người dùng theo ID (Admin only)")
    public ResponseEntity<ApiResponse<UserDTO.UserResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/me")
    @Operation(summary = "Cập nhật hồ sơ cá nhân")
    public ResponseEntity<ApiResponse<UserDTO.UserResponse>> updateProfile(@Valid @RequestBody UserDTO.UpdateUserRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", userService.updateUserProfile(request)));
    }

    @PutMapping("/me/password")
    @Operation(summary = "Đổi mật khẩu")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody UserDTO.ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin tạo tài khoản mới")
    public ResponseEntity<ApiResponse<UserDTO.UserResponse>> createAccount(@Valid @RequestBody UserDTO.CreateAccountRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo tài khoản thành công", userService.createAccountByAdmin(request)));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kích hoạt / Vô hiệu hóa tài khoản")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật trạng thái tài khoản"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa tài khoản (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa tài khoản"));
    }
}
