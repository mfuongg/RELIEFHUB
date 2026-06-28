package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.SupportRequestDTO;
import com.reliefhub.service.SupportRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/support-requests")
@RequiredArgsConstructor
@Tag(name = "Support Requests", description = "Yêu cầu hỗ trợ - quy trình 6 bước")
public class SupportRequestController {
    private final SupportRequestService supportRequestService;

    @GetMapping public ResponseEntity<ApiResponse<List<SupportRequestDTO.SupportRequestResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(supportRequestService.getAllRequests()));
    }
    @GetMapping("/me") @Operation(summary = "Yêu cầu hỗ trợ của tôi")
    public ResponseEntity<ApiResponse<List<SupportRequestDTO.SupportRequestResponse>>> getMy() {
        return ResponseEntity.ok(ApiResponse.success(supportRequestService.getMyRequests()));
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<SupportRequestDTO.SupportRequestResponse>>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success(supportRequestService.getRequestsByStatus(status)));
    }
    @PostMapping @Operation(summary = "Gửi yêu cầu hỗ trợ (Citizen)")
    public ResponseEntity<ApiResponse<SupportRequestDTO.SupportRequestResponse>> create(@Valid @RequestBody SupportRequestDTO.CreateSupportRequestRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Đã gửi yêu cầu", supportRequestService.createRequest(req)));
    }
    @PatchMapping("/{id}/advance") @Operation(summary = "Thay đổi trạng thái (Admin/Local)")
    public ResponseEntity<ApiResponse<SupportRequestDTO.SupportRequestResponse>> advance(@PathVariable Long id, @RequestBody SupportRequestDTO.AdvanceStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success(supportRequestService.advanceStatus(id, req)));
    }
}
