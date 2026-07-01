package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.InventoryDTO;
import com.reliefhub.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Quản lý kho hàng")
public class InventoryController {
    private final InventoryService service;

    @GetMapping
    @Operation(summary = "Lấy danh sách kho hàng")
    public ResponseEntity<ApiResponse<List<InventoryDTO.InventoryResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(service.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryDTO.InventoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Thêm mặt hàng vào kho")
    public ResponseEntity<ApiResponse<InventoryDTO.InventoryResponse>> create(@Valid @RequestBody InventoryDTO.CreateInventoryRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Đã thêm mặt hàng", service.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryDTO.InventoryResponse>> update(@PathVariable Long id, @RequestBody InventoryDTO.UpdateInventoryRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", service.update(id, req)));
    }

    @PatchMapping("/{id}/restock")
    @Operation(summary = "Nhập thêm hàng vào kho")
    public ResponseEntity<ApiResponse<InventoryDTO.InventoryResponse>> restock(@PathVariable Long id, @Valid @RequestBody InventoryDTO.RestockRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Đã nhập thêm hàng", service.restock(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa mặt hàng"));
    }
}
