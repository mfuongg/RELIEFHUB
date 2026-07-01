package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.DeliveryDTO;
import com.reliefhub.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/deliveries")
@RequiredArgsConstructor
@Tag(name = "Deliveries", description = "Quản lý vận chuyển và giao hàng")
public class DeliveryController {
    private final DeliveryService service;

    @GetMapping
    @Operation(summary = "Lấy danh sách chuyến giao hàng")
    public ResponseEntity<ApiResponse<List<DeliveryDTO.DeliveryResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll()));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<DeliveryDTO.DeliveryResponse>>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success(service.getByStatus(status)));
    }

    @PostMapping
    @Operation(summary = "Tạo chuyến giao hàng mới")
    public ResponseEntity<ApiResponse<DeliveryDTO.DeliveryResponse>> create(@Valid @RequestBody DeliveryDTO.CreateDeliveryRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Tạo chuyến giao hàng thành công", service.create(req)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái giao hàng")
    public ResponseEntity<ApiResponse<DeliveryDTO.DeliveryResponse>> updateStatus(@PathVariable Long id, @RequestBody DeliveryDTO.UpdateDeliveryStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success(service.updateStatus(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa chuyến giao hàng"));
    }
}
