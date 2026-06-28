package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.DisasterDTO;
import com.reliefhub.service.DisasterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disasters")
@RequiredArgsConstructor
@Tag(name = "Disasters", description = "Quản lý thông tin thiên tai")
public class DisasterController {

    private final DisasterService disasterService;

    @GetMapping
    @Operation(summary = "Lấy danh sách thiên tai")
    public ResponseEntity<ApiResponse<List<DisasterDTO.DisasterResponse>>> getAllDisasters() {
        return ResponseEntity.ok(ApiResponse.success(disasterService.getAllDisasters()));
    }

    @GetMapping("/active")
    @Operation(summary = "Lấy danh sách thiên tai đang hoạt động")
    public ResponseEntity<ApiResponse<List<DisasterDTO.DisasterResponse>>> getActiveDisasters() {
        return ResponseEntity.ok(ApiResponse.success(disasterService.getActiveDisasters()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết thiên tai")
    public ResponseEntity<ApiResponse<DisasterDTO.DisasterResponse>> getDisasterById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(disasterService.getDisasterById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','LOCAL')")
    @Operation(summary = "Tạo báo cáo thiên tai (Admin/Local only)")
    public ResponseEntity<ApiResponse<DisasterDTO.DisasterResponse>> createDisaster(@Valid @RequestBody DisasterDTO.CreateDisasterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đã ghi nhận thiên tai", disasterService.createDisaster(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LOCAL')")
    @Operation(summary = "Cập nhật thiên tai (Admin/Local only)")
    public ResponseEntity<ApiResponse<DisasterDTO.DisasterResponse>> updateDisaster(@PathVariable Long id, @Valid @RequestBody DisasterDTO.UpdateDisasterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", disasterService.updateDisaster(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LOCAL')")
    @Operation(summary = "Xóa thiên tai (Admin/Local only)")
    public ResponseEntity<ApiResponse<Void>> deleteDisaster(@PathVariable Long id) {
        disasterService.deleteDisaster(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa thiên tai"));
    }
}
